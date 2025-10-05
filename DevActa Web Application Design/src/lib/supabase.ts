import { createClient } from '@supabase/supabase-js';

// Supabase 1 - Authentication & Profiles
export const supabaseAuth = createClient(
  import.meta.env.VITE_SUPABASE_AUTH_URL || 'https://cqaxrwoulcvptgsqwwob.supabase.co',
  import.meta.env.VITE_SUPABASE_AUTH_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYXhyd291bGN2cHRnc3F3d29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDIxNDksImV4cCI6MjA3NTIxODE0OX0.2fF00Xk5Dsx8ezYiDWXLhDkXonGQDXR3Y1udi7MrLz8'
);

// Supabase 2 - Central Store (ACTA, Credits, Trophies)
export const supabaseCentral = createClient(
  import.meta.env.VITE_SUPABASE_CENTRAL_URL || 'https://nwcaqyduvujhaawsrpxe.supabase.co',
  import.meta.env.VITE_SUPABASE_CENTRAL_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Y2FxeWR1dnVqaGFhd3NycHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDEzMDksImV4cCI6MjA3NTIxNzMwOX0.cuNo-tQISVKut4g8w6jgbNUeTUTWtzqICXwPj3qyvnA'
);

// Supabase 3 - Posts & Explore
export const supabasePosts = createClient(
  import.meta.env.VITE_SUPABASE_POSTS_URL || 'https://tpiiwaensbimajaouvyi.supabase.co',
  import.meta.env.VITE_SUPABASE_POSTS_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaWl3YWVuc2JpbWFqYW91dnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDE3MjIsImV4cCI6MjA3NTIxNzcyMn0.29JgxFDCSchWkTUVn233EZKEb-ZNzzLakO5UzunsHDk'
);

// Supabase 4 - Games & Leaderboard
export const supabaseGames = createClient(
  import.meta.env.VITE_SUPABASE_GAMES_URL || 'https://aneoosskouaiunfjbobq.supabase.co',
  import.meta.env.VITE_SUPABASE_GAMES_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZW9vc3Nrb3VhaXVuZmpib2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDE4OTMsImV4cCI6MjA3NTIxNzg5M30.9EtW4OUt2XVgDUgLi7r_r8zaEXft2YGo8zTpuSPA3sY'
);

// Supabase 5 - Challenges & Hackathons
export const supabaseChallenges = createClient(
  import.meta.env.VITE_SUPABASE_CHALLENGES_URL || 'https://kjqyxqpqvwxictovryvl.supabase.co',
  import.meta.env.VITE_SUPABASE_CHALLENGES_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcXl4cXBxdnd4aWN0b3ZyeXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDIwMzgsImV4cCI6MjA3NTIxODAzOH0.HMOg25t-mPU8HHMrusV7TmLVX5kHw03RgLlDF42iFR8'
);

// Type definitions
export interface Profile {
  id: string;
  auth_uid: string;
  github_username: string;
  github_url: string;
  linkedin_url: string;
  profile_pic_url: string;
  first_name: string;
  last_name: string;
  bio: string;
  tags: string[];
  created_at: string;
}

export interface Survey {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  tagline: string;
  skills: string[];
  availability: string;
  timezone: string;
  extra: Record<string, any>;
  created_at: string;
}

export interface CentralProfile {
  id: string;
  auth_uid: string;
  display_name: string;
  username: string;
  profile_pic_url: string;
  headline: string;
  tags: string[];
  posts_count: number;
  trophies_total: number;
  acta_balance: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  repo_url: string;
  summary: string;
  tags: string[];
  created_at: string;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'smile' | 'numb' | 'sad';
  created_at: string;
}

export interface Challenge {
  id: string;
  host_id: string;
  title: string;
  description: string;
  max_players: number;
  current_players: number;
  join_link: string;
  repo_link: string;
  contact_email: string;
  status: 'open' | 'closed' | 'ongoing' | 'finished';
  created_at: string;
}
