import { supabaseGames } from '../lib/supabase';
import { consumeActaCards, awardTrophies } from './centralService';

/**
 * Supabase 4 - Games & Leaderboard
 */

// Consume ACTA cards to start a game
export async function startGame(userId: string, gameName: string, cost: number) {
  try {
    // Consume ACTA cards from central store
    const result = await consumeActaCards(userId, cost, `game:start:${gameName}`, gameName);
    
    if (!result || result.success === false) {
      throw new Error('Insufficient ACTA balance');
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to start game:', error);
    return { success: false, error };
  }
}

// Complete a game and award trophies
export async function completeGame(
  userId: string,
  gameName: string,
  result: 'win' | 'lose',
  score: number
) {
  // Insert game record
  const { data: gameData, error: gameError } = await supabaseGames
    .from('games_played')
    .insert({
      user_id: userId,
      game_name: gameName,
      result,
      trophies_awarded: result === 'win' ? 3 : 0,
      score,
    })
    .select()
    .single();

  if (gameError) throw gameError;

  // Award trophies if won
  if (result === 'win') {
    try {
      await awardTrophies(userId, 3, `game:win:${gameName}`);
      await updateLeaderboard(userId);
    } catch (error) {
      console.error('Failed to award trophies:', error);
    }
  }

  return gameData;
}

// Update leaderboard for user
async function updateLeaderboard(userId: string) {
  // Get total trophies for user
  const { data: gamesData } = await supabaseGames
    .from('games_played')
    .select('trophies_awarded')
    .eq('user_id', userId);

  const totalTrophies = gamesData?.reduce((sum, game) => sum + game.trophies_awarded, 0) || 0;

  // Upsert leaderboard entry
  await supabaseGames
    .from('leaderboard')
    .upsert(
      {
        user_id: userId,
        trophies: totalTrophies,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
}

// Get leaderboard
export async function getLeaderboard(limit = 100) {
  const { data, error } = await supabaseGames
    .from('leaderboard')
    .select('*')
    .order('trophies', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Get user's game history
export async function getGameHistory(userId: string, limit = 50) {
  const { data, error } = await supabaseGames
    .from('games_played')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Get user's trophy count
export async function getUserTrophies(userId: string) {
  const { data, error } = await supabaseGames
    .from('trophies')
    .select('total')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If no record exists, return 0
    if (error.code === 'PGRST116') return { total: 0 };
    throw error;
  }

  return data;
}

// Subscribe to leaderboard changes
export function subscribeToLeaderboard(callback: (entry: any) => void) {
  return supabaseGames
    .channel('leaderboard-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboard',
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}

// Subscribe to user's trophy changes
export function subscribeToUserTrophies(userId: string, callback: (trophies: any) => void) {
  return supabaseGames
    .channel(`trophies-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trophies',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
