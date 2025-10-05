import { supabaseAuth, supabaseCentral, type Profile } from '../lib/supabase';

/**
 * Supabase 1 - Authentication & Profile Management
 */

// Sign in with GitHub
export async function signInWithGitHub() {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

// Sign in with LinkedIn
export async function signInWithLinkedIn() {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabaseAuth.auth.getUser();
  if (error) throw error;
  return user;
}

// Sign out
export async function signOut() {
  const { error } = await supabaseAuth.auth.signOut();
  if (error) throw error;
}

// Upsert profile after GitHub login
export async function upsertProfile(authUser: any) {
  const profile = {
    auth_uid: authUser.id,
    github_username: authUser.user_metadata?.user_name || authUser.user_metadata?.preferred_username || '',
    github_url: authUser.user_metadata?.html_url || `https://github.com/${authUser.user_metadata?.user_name}`,
    profile_pic_url: authUser.user_metadata?.avatar_url || '',
    first_name: authUser.user_metadata?.full_name?.split(' ')[0] || '',
    last_name: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
    bio: authUser.user_metadata?.bio || '',
    tags: [],
  };

  const { data, error } = await supabaseAuth
    .from('profiles')
    .upsert(profile, { onConflict: 'auth_uid' })
    .select()
    .single();

  if (error) throw error;

  // Also sync to central profiles
  await syncToCentralProfile(data);

  return data;
}

// Get profile by auth_uid
export async function getProfile(authUid: string) {
  const { data, error } = await supabaseAuth
    .from('profiles')
    .select('*')
    .eq('auth_uid', authUid)
    .single();

  if (error) throw error;
  return data as Profile;
}

// Submit survey
export async function submitSurvey(surveyData: {
  user_id: string;
  username: string;
  display_name: string;
  tagline: string;
  skills: string[];
  availability: string;
  timezone: string;
  extra?: Record<string, any>;
}) {
  const { data, error } = await supabaseAuth
    .from('surveys')
    .insert(surveyData)
    .select()
    .single();

  if (error) throw error;

  // Sync survey data to central profiles
  await supabaseCentral.rpc('rpc_upsert_profile', {
    payload: {
      auth_uid: surveyData.user_id,
      display_name: surveyData.display_name,
      username: surveyData.username,
      headline: surveyData.tagline,
      tags: surveyData.skills,
    },
  });

  return data;
}

// Sync profile to central store
async function syncToCentralProfile(profile: Profile) {
  try {
    await supabaseCentral.rpc('rpc_upsert_profile', {
      payload: {
        auth_uid: profile.auth_uid,
        display_name: `${profile.first_name} ${profile.last_name}`.trim(),
        username: profile.github_username,
        profile_pic_url: profile.profile_pic_url,
        headline: profile.bio,
        tags: profile.tags,
      },
    });
  } catch (error) {
    console.error('Failed to sync to central profile:', error);
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: any) => void) {
  return supabaseAuth.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}

// Subscribe to profile changes
export function subscribeToProfile(authUid: string, callback: (profile: Profile) => void) {
  return supabaseAuth
    .channel('profile-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `auth_uid=eq.${authUid}`,
      },
      (payload) => {
        callback(payload.new as Profile);
      }
    )
    .subscribe();
}
