import { supabaseCentral, type CentralProfile } from '../lib/supabase';

/**
 * Supabase 2 - Central Store (ACTA, Credits, Trophies)
 */

// Get central profile by auth_uid
export async function getCentralProfile(authUid: string) {
  const { data, error } = await supabaseCentral
    .from('central_profiles')
    .select('*')
    .eq('auth_uid', authUid)
    .single();

  if (error) throw error;
  return data as CentralProfile;
}

// Add ACTA cards
export async function addActaCards(
  userId: string,
  amount: number,
  reason: string,
  sourceId: string
) {
  const { data, error } = await supabaseCentral.rpc('rpc_add_acta_cards', {
    user_id: userId,
    amount,
    reason,
    source_id: sourceId,
  });

  if (error) throw error;
  return data;
}

// Consume ACTA cards
export async function consumeActaCards(
  userId: string,
  amount: number,
  reason: string,
  sourceId: string
) {
  const { data, error } = await supabaseCentral.rpc('rpc_consume_acta_cards', {
    user_id: userId,
    amount,
    reason,
    source_id: sourceId,
  });

  if (error) throw error;
  return data;
}

// Award trophies
export async function awardTrophies(
  userId: string,
  amount: number,
  sourceId: string
) {
  const { data, error } = await supabaseCentral.rpc('rpc_award_trophies', {
    user_id: userId,
    amount,
    source_id: sourceId,
  });

  if (error) throw error;
  return data;
}

// Get ACTA ledger for user
export async function getActaLedger(userId: string, limit = 50) {
  const { data, error } = await supabaseCentral
    .from('acta_ledger')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Subscribe to central profile changes
export function subscribeToCentralProfile(authUid: string, callback: (profile: CentralProfile) => void) {
  return supabaseCentral
    .channel('central-profile-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'central_profiles',
        filter: `auth_uid=eq.${authUid}`,
      },
      (payload) => {
        callback(payload.new as CentralProfile);
      }
    )
    .subscribe();
}

// Subscribe to ACTA ledger changes
export function subscribeToActaLedger(userId: string, callback: (ledger: any) => void) {
  return supabaseCentral
    .channel('acta-ledger-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'acta_ledger',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
