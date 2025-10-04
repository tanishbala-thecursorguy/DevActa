# 🚀 Database Quick Start

## What You Got

✅ **Complete PostgreSQL schema** for Supabase  
✅ **14 core tables** with relationships  
✅ **Row Level Security** policies configured  
✅ **Automatic triggers** for stats updates  
✅ **Real-time subscriptions** ready  
✅ **Optimized indexes** for performance  

## 5-Minute Setup

### 1️⃣ Create Supabase Account
```
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Save your database password!
```

### 2️⃣ Run Schema
```
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste content from: supabase_schema.sql
4. Click Run ▶️
5. Done! (takes ~30 seconds)
```

### 3️⃣ Get API Keys
```
1. Go to Settings → API
2. Copy:
   - Project URL
   - anon/public key
```

### 4️⃣ Configure App
```bash
# Create .env.local in: DevActa Web Application Design/
cp env.template "DevActa Web Application Design/.env.local"

# Edit and add your keys:
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

### 5️⃣ Install Supabase Client
```bash
cd "DevActa Web Application Design"
npm install @supabase/supabase-js
```

## 📊 What's Included

### Core Features
- 👤 **User Profiles** - Extended auth with stats
- 🎮 **Games System** - Scores, leaderboards
- 🏆 **Achievements** - Unlock badges
- 🎯 **Challenges** - Coding problems
- 📝 **Social Feed** - Posts, comments, likes
- 💼 **Job Board** - Postings & applications
- 🚀 **Hackathons** - Events & registrations
- 🔔 **Notifications** - Real-time alerts

### Tables Overview

| Table | Purpose | Key Features |
|-------|---------|-------------|
| `profiles` | User info | Points, stats, skills |
| `games` | Game catalog | Difficulty, rewards |
| `game_scores` | Player scores | Auto-updates points |
| `posts` | Social feed | Images, code snippets |
| `hackathons` | Events | Dates, prizes, themes |
| `challenges` | Code problems | Test cases, submissions |
| `jobs` | Job postings | Skills, salary, remote |
| `achievements` | Badges | Auto-unlock system |

## 🔥 Example Queries

### Get Top 10 Players
```javascript
const { data } = await supabase
  .from('global_leaderboard')
  .select('*')
  .limit(10);
```

### Save Game Score
```javascript
await supabase.from('game_scores').insert({
  game_id: gameId,
  user_id: userId,
  score: 1500,
  points_earned: 15
});
// Automatically updates user's total points!
```

### Create Post
```javascript
await supabase.from('posts').insert({
  user_id: userId,
  content: 'Just beat the high score! 🎮',
  post_type: 'achievement'
});
```

### Get User Profile with Stats
```javascript
const { data } = await supabase
  .from('profiles')
  .select(`
    *,
    user_achievements(achievement_id, completed),
    game_scores(score, game_id)
  `)
  .eq('id', userId)
  .single();
```

## 🔐 Security Features

✅ Row Level Security (RLS) enabled  
✅ Users can only edit their own data  
✅ Public read for games, posts, profiles  
✅ Private notifications  
✅ Secure authentication via Supabase Auth  

## 📱 Real-time Features

```javascript
// Listen for new posts
supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => addPostToFeed(payload.new)
  )
  .subscribe();

// Listen for your notifications
supabase
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

## 🛠️ Useful Commands

### Refresh Leaderboard
```sql
SELECT refresh_leaderboard();
```

### Check User Stats
```sql
SELECT 
  username, 
  total_points, 
  games_played, 
  achievements_count 
FROM profiles 
WHERE id = 'user-uuid';
```

### Get Game Stats
```sql
SELECT 
  g.title,
  COUNT(gs.id) as plays,
  AVG(gs.score) as avg_score
FROM games g
LEFT JOIN game_scores gs ON g.id = gs.game_id
GROUP BY g.id, g.title
ORDER BY plays DESC;
```

## 📚 Full Documentation

See `SUPABASE_SETUP.md` for:
- Detailed table descriptions
- All triggers and functions
- Security policies
- Performance optimization
- Troubleshooting guide

## 🎯 Next Steps

1. ✅ Run the schema in Supabase
2. ✅ Configure environment variables
3. ✅ Install Supabase client
4. 🔨 Start building features!
5. 📱 Enable real-time subscriptions
6. 🚀 Deploy to production

## 🤔 Need Help?

- 📖 Read: `SUPABASE_SETUP.md`
- 🌐 Docs: https://supabase.com/docs
- 💬 Discord: https://discord.supabase.com
- 📧 Support: support@supabase.com

---

**Built for hackathons. Optimized for speed. Ready to scale. 🚀**
