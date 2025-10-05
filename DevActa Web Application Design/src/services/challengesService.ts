import { supabaseChallenges, type Challenge } from '../lib/supabase';
import { createPost } from './postsService';

/**
 * Supabase 5 - Challenges & Hackathons
 */

// Create a new challenge
export async function createChallenge(challengeData: {
  host_id: string;
  title: string;
  description: string;
  max_players: number;
  join_link: string;
  repo_link: string;
  contact_email: string;
}) {
  const { data, error } = await supabaseChallenges
    .from('challenges')
    .insert({
      ...challengeData,
      current_players: 1, // Host is the first player
      status: 'open',
    })
    .select()
    .single();

  if (error) throw error;

  // Also create a post in the Posts project for visibility
  try {
    await createPost({
      user_id: challengeData.host_id,
      title: `🏆 Challenge: ${challengeData.title}`,
      repo_url: challengeData.repo_link,
      summary: challengeData.description,
      tags: ['challenge', 'hackathon'],
    });
  } catch (postError) {
    console.error('Failed to create post for challenge:', postError);
  }

  // Create host as first participant
  await supabaseChallenges
    .from('challenge_participants')
    .insert({
      challenge_id: data.id,
      user_id: challengeData.host_id,
      role: 'host',
    });

  return data as Challenge;
}

// Get all challenges
export async function getChallenges(status?: string) {
  let query = supabaseChallenges
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Challenge[];
}

// Get single challenge
export async function getChallenge(challengeId: string) {
  const { data, error } = await supabaseChallenges
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .single();

  if (error) throw error;
  return data as Challenge;
}

// Join a challenge
export async function joinChallenge(challengeId: string, userId: string) {
  // Get current challenge data
  const challenge = await getChallenge(challengeId);

  // Check if already full
  if (challenge.current_players >= challenge.max_players) {
    throw new Error('Challenge is full');
  }

  // Check if user already joined
  const { data: existingParticipant } = await supabaseChallenges
    .from('challenge_participants')
    .select('*')
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .single();

  if (existingParticipant) {
    throw new Error('Already joined this challenge');
  }

  // Add participant
  const { data: participant, error: participantError } = await supabaseChallenges
    .from('challenge_participants')
    .insert({
      challenge_id: challengeId,
      user_id: userId,
      role: 'participant',
    })
    .select()
    .single();

  if (participantError) throw participantError;

  // Increment current_players
  const { data: updatedChallenge, error: updateError } = await supabaseChallenges
    .from('challenges')
    .update({ current_players: challenge.current_players + 1 })
    .eq('id', challengeId)
    .select()
    .single();

  if (updateError) throw updateError;

  return { participant, challenge: updatedChallenge };
}

// Leave a challenge
export async function leaveChallenge(challengeId: string, userId: string) {
  // Remove participant
  const { error: deleteError } = await supabaseChallenges
    .from('challenge_participants')
    .delete()
    .eq('challenge_id', challengeId)
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  // Decrement current_players
  const challenge = await getChallenge(challengeId);
  await supabaseChallenges
    .from('challenges')
    .update({ current_players: Math.max(0, challenge.current_players - 1) })
    .eq('id', challengeId);
}

// Update challenge status
export async function updateChallengeStatus(
  challengeId: string,
  status: 'open' | 'closed' | 'ongoing' | 'finished'
) {
  const { data, error } = await supabaseChallenges
    .from('challenges')
    .update({ status })
    .eq('id', challengeId)
    .select()
    .single();

  if (error) throw error;
  return data as Challenge;
}

// Get challenge participants
export async function getChallengeParticipants(challengeId: string) {
  const { data, error } = await supabaseChallenges
    .from('challenge_participants')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Get user's challenges
export async function getUserChallenges(userId: string) {
  const { data, error } = await supabaseChallenges
    .from('challenge_participants')
    .select('challenge_id')
    .eq('user_id', userId);

  if (error) throw error;

  const challengeIds = data.map(p => p.challenge_id);
  
  if (challengeIds.length === 0) return [];

  const { data: challenges, error: challengesError } = await supabaseChallenges
    .from('challenges')
    .select('*')
    .in('id', challengeIds)
    .order('created_at', { ascending: false });

  if (challengesError) throw challengesError;
  return challenges as Challenge[];
}

// Subscribe to challenges (realtime)
export function subscribeToChallenges(callback: (challenge: Challenge) => void) {
  return supabaseChallenges
    .channel('challenges-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenges',
      },
      (payload) => {
        callback(payload.new as Challenge);
      }
    )
    .subscribe();
}

// Subscribe to challenge participants
export function subscribeToChallengeParticipants(
  challengeId: string,
  callback: (participant: any) => void
) {
  return supabaseChallenges
    .channel(`challenge-participants-${challengeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenge_participants',
        filter: `challenge_id=eq.${challengeId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
