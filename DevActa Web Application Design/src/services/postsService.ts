import { supabasePosts, type Post, type Reaction } from '../lib/supabase';
import { addActaCards } from './centralService';

/**
 * Supabase 3 - Posts & Explore
 */

// Create a new post
export async function createPost(postData: {
  user_id: string;
  title: string;
  repo_url: string;
  summary: string;
  tags: string[];
}) {
  const { data, error } = await supabasePosts
    .from('posts')
    .insert(postData)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

// Get all posts (for Explore page)
export async function getPosts(limit = 50, offset = 0) {
  const { data, error } = await supabasePosts
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as Post[];
}

// Get posts by user
export async function getPostsByUser(userId: string) {
  const { data, error } = await supabasePosts
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

// Get single post
export async function getPost(postId: string) {
  const { data, error } = await supabasePosts
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data as Post;
}

// Add reaction to post
export async function addReaction(
  postId: string,
  userId: string,
  reactionType: 'smile' | 'numb' | 'sad',
  postOwnerId: string
) {
  // Insert reaction (unique constraint prevents duplicates)
  const { data, error } = await supabasePosts
    .from('reactions')
    .upsert(
      {
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType,
      },
      { onConflict: 'post_id,user_id' }
    )
    .select()
    .single();

  if (error) throw error;

  // Award ACTA cards based on reaction type
  try {
    if (reactionType === 'smile') {
      await addActaCards(postOwnerId, 5, `reaction:+smile`, postId);
    } else if (reactionType === 'numb' || reactionType === 'sad') {
      await addActaCards(postOwnerId, -1, `reaction:${reactionType}`, postId);
    }
  } catch (actaError) {
    console.error('Failed to update ACTA cards:', actaError);
  }

  return data as Reaction;
}

// Remove reaction
export async function removeReaction(postId: string, userId: string) {
  const { error } = await supabasePosts
    .from('reactions')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Get reactions for a post
export async function getReactionsForPost(postId: string) {
  const { data, error } = await supabasePosts
    .from('reactions')
    .select('*')
    .eq('post_id', postId);

  if (error) throw error;
  return data as Reaction[];
}

// Get reaction counts for a post
export async function getReactionCounts(postId: string) {
  const reactions = await getReactionsForPost(postId);
  
  return {
    smile: reactions.filter(r => r.reaction_type === 'smile').length,
    numb: reactions.filter(r => r.reaction_type === 'numb').length,
    sad: reactions.filter(r => r.reaction_type === 'sad').length,
    total: reactions.length,
  };
}

// Subscribe to posts (realtime)
export function subscribeToPosts(callback: (post: Post) => void) {
  return supabasePosts
    .channel('posts-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      },
      (payload) => {
        callback(payload.new as Post);
      }
    )
    .subscribe();
}

// Subscribe to reactions for a post
export function subscribeToReactions(postId: string, callback: (reaction: Reaction) => void) {
  return supabasePosts
    .channel(`reactions-${postId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reactions',
        filter: `post_id=eq.${postId}`,
      },
      (payload) => {
        callback(payload.new as Reaction);
      }
    )
    .subscribe();
}
