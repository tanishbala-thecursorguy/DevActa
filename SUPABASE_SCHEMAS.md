# Supabase Database Schemas

Complete SQL schemas for all 5 Supabase projects. Run these in the SQL Editor of each respective Supabase project.

---

## Supabase 1: Authentication & Profiles
**URL**: https://cqaxrwoulcvptgsqwwob.supabase.co

### Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid TEXT UNIQUE NOT NULL,
  github_username TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  profile_pic_url TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT,
  display_name TEXT,
  tagline TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  availability TEXT,
  timezone TEXT,
  extra JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON profiles(auth_uid);
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = auth_uid);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = auth_uid);

-- Surveys policies
CREATE POLICY "Public surveys are viewable by everyone"
  ON surveys FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own survey"
  ON surveys FOR INSERT
  WITH CHECK (auth.uid()::text = (SELECT auth_uid FROM profiles WHERE id = user_id));

CREATE POLICY "Users can update their own survey"
  ON surveys FOR UPDATE
  USING (auth.uid()::text = (SELECT auth_uid FROM profiles WHERE id = user_id));
```

### GitHub OAuth Setup
1. Go to **Authentication** → **Providers** → **GitHub**
2. Enable GitHub provider
3. Set redirect URL to your app URL (e.g., `http://localhost:3000` or `https://devacta.vercel.app`)

---

## Supabase 2: Central Store (ACTA, Credits, Trophies)
**URL**: https://nwcaqyduvujhaawsrpxe.supabase.co

### Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Central profiles (replicated from Supabase 1)
CREATE TABLE IF NOT EXISTS central_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid TEXT UNIQUE NOT NULL,
  display_name TEXT,
  username TEXT,
  profile_pic_url TEXT,
  headline TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  posts_count INTEGER DEFAULT 0,
  trophies_total INTEGER DEFAULT 0,
  acta_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACTA ledger (transaction log)
CREATE TABLE IF NOT EXISTS acta_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES central_profiles(id) ON DELETE CASCADE,
  change INTEGER NOT NULL,
  reason TEXT,
  source_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync log (for cross-project synchronization)
CREATE TABLE IF NOT EXISTS sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_central_profiles_auth_uid ON central_profiles(auth_uid);
CREATE INDEX IF NOT EXISTS idx_central_profiles_username ON central_profiles(username);
CREATE INDEX IF NOT EXISTS idx_acta_ledger_user_id ON acta_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_processed ON sync_log(processed);
```

### RPC Functions

```sql
-- Upsert profile from external data
CREATE OR REPLACE FUNCTION rpc_upsert_profile(payload JSONB)
RETURNS central_profiles AS $$
DECLARE
  result central_profiles;
BEGIN
  INSERT INTO central_profiles (
    auth_uid,
    display_name,
    username,
    profile_pic_url,
    headline,
    tags
  ) VALUES (
    payload->>'auth_uid',
    payload->>'display_name',
    payload->>'username',
    payload->>'profile_pic_url',
    payload->>'headline',
    COALESCE((payload->'tags')::jsonb, '[]'::jsonb)
  )
  ON CONFLICT (auth_uid) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    username = EXCLUDED.username,
    profile_pic_url = EXCLUDED.profile_pic_url,
    headline = EXCLUDED.headline,
    tags = EXCLUDED.tags,
    updated_at = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add ACTA cards
CREATE OR REPLACE FUNCTION rpc_add_acta_cards(
  user_id UUID,
  amount INTEGER,
  reason TEXT,
  source_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update balance
  UPDATE central_profiles
  SET acta_balance = acta_balance + amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Insert ledger entry
  INSERT INTO acta_ledger (user_id, change, reason, source_id)
  VALUES (user_id, amount, reason, source_id);
  
  result := jsonb_build_object('success', true, 'amount', amount);
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Consume ACTA cards
CREATE OR REPLACE FUNCTION rpc_consume_acta_cards(
  user_id UUID,
  amount INTEGER,
  reason TEXT,
  source_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  current_balance INTEGER;
  result JSONB;
BEGIN
  -- Get current balance
  SELECT acta_balance INTO current_balance
  FROM central_profiles
  WHERE id = user_id;
  
  -- Check if sufficient balance
  IF current_balance < amount THEN
    result := jsonb_build_object('success', false, 'error', 'Insufficient balance');
    RETURN result;
  END IF;
  
  -- Update balance
  UPDATE central_profiles
  SET acta_balance = acta_balance - amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Insert ledger entry
  INSERT INTO acta_ledger (user_id, change, reason, source_id)
  VALUES (user_id, -amount, reason, source_id);
  
  result := jsonb_build_object('success', true, 'amount', amount);
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award trophies
CREATE OR REPLACE FUNCTION rpc_award_trophies(
  user_id UUID,
  amount INTEGER,
  source_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update trophies
  UPDATE central_profiles
  SET trophies_total = trophies_total + amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Log sync event
  INSERT INTO sync_log (event_type, payload)
  VALUES ('trophy_awarded', jsonb_build_object(
    'user_id', user_id,
    'amount', amount,
    'source_id', source_id
  ));
  
  result := jsonb_build_object('success', true, 'amount', amount);
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE central_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE acta_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- Central profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON central_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON central_profiles FOR UPDATE
  USING (auth.uid()::text = auth_uid);

-- ACTA ledger policies
CREATE POLICY "Users can view their own ledger"
  ON acta_ledger FOR SELECT
  USING (user_id IN (SELECT id FROM central_profiles WHERE auth_uid = auth.uid()::text));

-- Sync log policies (admin only)
CREATE POLICY "Admins can view sync log"
  ON sync_log FOR SELECT
  USING (auth.role() = 'service_role');
```

---

## Supabase 3: Posts & Explore
**URL**: https://tpiiwaensbimajaouvyi.supabase.co

### Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  repo_url TEXT,
  summary TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('smile', 'numb', 'sad')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- Reactions policies
CREATE POLICY "Public reactions are viewable by everyone"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own reactions"
  ON reactions FOR UPDATE
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  USING (user_id::text = auth.uid()::text);
```

---

## Supabase 4: Games & Leaderboard
**URL**: https://aneoosskouaiunfjbobq.supabase.co

### Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ACTA cards (local copy for games)
CREATE TABLE IF NOT EXISTS acta_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games played
CREATE TABLE IF NOT EXISTS games_played (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  game_name TEXT NOT NULL,
  result TEXT CHECK (result IN ('win', 'lose')),
  trophies_awarded INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trophies
CREATE TABLE IF NOT EXISTS trophies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  total INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  trophies INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_games_played_user_id ON games_played(user_id);
CREATE INDEX IF NOT EXISTS idx_games_played_created_at ON games_played(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_trophies ON leaderboard(trophies DESC);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE acta_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_played ENABLE ROW LEVEL SECURITY;
ALTER TABLE trophies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- ACTA cards policies
CREATE POLICY "Users can view their own balance"
  ON acta_cards FOR SELECT
  USING (user_id::text = auth.uid()::text);

-- Games played policies
CREATE POLICY "Public games are viewable by everyone"
  ON games_played FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert games"
  ON games_played FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Trophies policies
CREATE POLICY "Public trophies are viewable by everyone"
  ON trophies FOR SELECT
  USING (true);

-- Leaderboard policies
CREATE POLICY "Public leaderboard is viewable by everyone"
  ON leaderboard FOR SELECT
  USING (true);
```

---

## Supabase 5: Challenges & Hackathons
**URL**: https://kjqyxqpqvwxictovryvl.supabase.co

### Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  max_players INTEGER NOT NULL,
  current_players INTEGER DEFAULT 0,
  join_link TEXT,
  repo_link TEXT,
  contact_email TEXT,
  status TEXT CHECK (status IN ('open', 'closed', 'ongoing', 'finished')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge participants
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT CHECK (role IN ('host', 'participant')) DEFAULT 'participant',
  UNIQUE(challenge_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_challenges_host_id ON challenges(host_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON challenges(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON challenge_participants(user_id);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Challenges policies
CREATE POLICY "Public challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Hosts can update their own challenges"
  ON challenges FOR UPDATE
  USING (host_id::text = auth.uid()::text);

CREATE POLICY "Hosts can delete their own challenges"
  ON challenges FOR DELETE
  USING (host_id::text = auth.uid()::text);

-- Challenge participants policies
CREATE POLICY "Public participants are viewable by everyone"
  ON challenge_participants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join challenges"
  ON challenge_participants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can leave challenges"
  ON challenge_participants FOR DELETE
  USING (user_id::text = auth.uid()::text);
```

---

## Setup Instructions

### For Each Supabase Project:

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the relevant SQL schema
3. **Run the SQL** to create tables, indexes, RLS policies, and functions
4. **Verify** tables are created in the Table Editor

### Enable Realtime:

For each table that needs realtime updates:
1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - Supabase 1: `profiles`, `surveys`
   - Supabase 2: `central_profiles`, `acta_ledger`
   - Supabase 3: `posts`, `reactions`
   - Supabase 4: `leaderboard`, `trophies`
   - Supabase 5: `challenges`, `challenge_participants`

### Test Checklist:

- [ ] GitHub OAuth login works (Supabase 1)
- [ ] Profile is created after login
- [ ] Survey submission works
- [ ] Central profile is synced (Supabase 2)
- [ ] Posts can be created (Supabase 3)
- [ ] Reactions award ACTA cards
- [ ] Games consume ACTA cards (Supabase 4)
- [ ] Trophies are awarded on game win
- [ ] Leaderboard updates
- [ ] Challenges can be created (Supabase 5)
- [ ] Users can join challenges
- [ ] Realtime updates work for all tables
