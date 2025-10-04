# Supabase Database Setup Guide

## 📚 Overview

This database schema supports a complete gaming and developer platform with:
- User profiles & authentication
- Gaming system with scores & leaderboards
- Hackathons & registrations
- Coding challenges
- Social features (posts, comments, likes, follows)
- Job board & applications
- Achievements & badges
- Real-time notifications

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: DevActa
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

### 2. Run the Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `supabase_schema.sql`
4. Paste and click **Run**
5. Wait for completion (should take ~30 seconds)

### 3. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable providers you want:
   - ✅ Email
   - ✅ GitHub (recommended for developers)
   - ✅ Google
   - ✅ Discord

3. Configure redirect URLs:
   - **Site URL**: `http://localhost:3001` (development)
   - **Redirect URLs**: `http://localhost:3001/auth/callback`

### 4. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL`
   - `anon/public` key
   - `service_role` key (keep secret!)

### 5. Configure Your App

Create `.env.local` in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service role key (NEVER expose to client!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📊 Database Structure

### Core Tables

#### Users & Profiles
- `profiles` - Extended user information
- `user_skills` - Skills and proficiency levels
- `user_achievements` - Unlocked achievements

#### Gaming
- `games` - Available games
- `game_scores` - Player scores and history
- `global_leaderboard` - Top players (materialized view)

#### Hackathons
- `hackathons` - Event information
- `hackathon_registrations` - User registrations

#### Challenges
- `challenges` - Coding challenges
- `challenge_submissions` - User solutions

#### Social
- `posts` - User posts/feed
- `comments` - Post comments
- `likes` - Likes on posts/comments
- `follows` - User following relationships

#### Jobs
- `jobs` - Job postings
- `job_applications` - Applications

#### System
- `achievements` - Achievement definitions
- `notifications` - User notifications

## 🔐 Security (Row Level Security)

The schema includes RLS policies for:

- **Public Read**: Games, posts, profiles, leaderboards
- **User Write**: Users can only create/update their own data
- **Protected**: Notifications are private to each user

### Important Policies

```sql
-- Users can only see their own notifications
"Users can view own notifications"

-- Users can only update their own profile
"Users can update own profile"

-- Anyone can view posts, but only authors can edit
"Posts are viewable by everyone"
"Users can update own posts"
```

## 📈 Performance Optimizations

### Indexes
Pre-configured indexes for:
- Leaderboard queries (score + time)
- Feed pagination (created_at DESC)
- User lookups (username, email)
- Search optimization

### Materialized View
`global_leaderboard` - Cached top 100 players

Refresh manually or via cron:
```sql
SELECT refresh_leaderboard();
```

## 🔄 Realtime Subscriptions

Enable realtime for live updates:

```javascript
// Subscribe to new posts
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => console.log('New post!', payload)
  )
  .subscribe();

// Subscribe to notifications
const notifSub = supabase
  .channel(`notifications:${userId}`)
  .on('postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => showNotification(payload.new)
  )
  .subscribe();
```

## 🛠️ Common Operations

### Create a User Profile (after sign-up)

```javascript
const { data, error } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    username: 'player123',
    full_name: 'John Doe',
    skill_level: 'intermediate'
  });
```

### Record a Game Score

```javascript
const { data, error } = await supabase
  .from('game_scores')
  .insert({
    game_id: gameId,
    user_id: userId,
    score: 1500,
    time_taken: 120,
    completed: true,
    points_earned: 15
  });
// Triggers automatically update user's total_points!
```

### Get Leaderboard

```javascript
const { data: leaderboard } = await supabase
  .from('global_leaderboard')
  .select('*')
  .limit(10);
```

### Create a Post

```javascript
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: userId,
    content: 'Just beat the high score!',
    post_type: 'achievement'
  });
```

### Like a Post

```javascript
const { data, error } = await supabase
  .from('likes')
  .insert({
    user_id: userId,
    likeable_type: 'post',
    likeable_id: postId
  });
// Triggers automatically increment post's likes_count!
```

## 🔧 Maintenance

### Refresh Leaderboard
Run daily via Supabase cron or your backend:

```sql
SELECT refresh_leaderboard();
```

### Clean Old Notifications
```sql
DELETE FROM notifications 
WHERE created_at < NOW() - INTERVAL '30 days' 
AND is_read = true;
```

### Update Game Stats
```sql
UPDATE games g
SET 
  play_count = (SELECT COUNT(*) FROM game_scores WHERE game_id = g.id),
  average_score = (SELECT AVG(score) FROM game_scores WHERE game_id = g.id);
```

## 📱 Client Integration

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Initialize Client

```javascript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Authentication Hook

```javascript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

## 🐛 Troubleshooting

### Issue: RLS policies blocking queries
**Solution**: Make sure user is authenticated:
```javascript
const { data: session } = await supabase.auth.getSession();
if (!session) {
  // Redirect to login
}
```

### Issue: Triggers not firing
**Solution**: Check trigger was created successfully:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%likes%';
```

### Issue: Slow queries
**Solution**: Check indexes exist:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'game_scores';
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Documentation](https://supabase.com/docs/guides/realtime)

## 🤝 Support

For issues or questions:
1. Check [Supabase Discord](https://discord.supabase.com)
2. Review [GitHub Issues](https://github.com/supabase/supabase/issues)
3. Read [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

**Happy Building! 🚀**
