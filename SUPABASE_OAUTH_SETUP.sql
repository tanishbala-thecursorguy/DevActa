-- Run this SQL in Supabase 1 (https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/sql)

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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = auth_uid);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = auth_uid);

-- Surveys policies
DROP POLICY IF EXISTS "Public surveys are viewable by everyone" ON surveys;
CREATE POLICY "Public surveys are viewable by everyone"
  ON surveys FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own survey" ON surveys;
CREATE POLICY "Users can insert their own survey"
  ON surveys FOR INSERT
  WITH CHECK (auth.uid()::text = (SELECT auth_uid FROM profiles WHERE id = user_id));

DROP POLICY IF EXISTS "Users can update their own survey" ON surveys;
CREATE POLICY "Users can update their own survey"
  ON surveys FOR UPDATE
  USING (auth.uid()::text = (SELECT auth_uid FROM profiles WHERE id = user_id));
