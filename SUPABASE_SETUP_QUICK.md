# Supabase Setup - Quick Guide

## 1. Create Profiles Table

Run this SQL in your Supabase SQL Editor (Project: `cqaxrwoulcvptgsqwwob`):

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  profile_pic_url TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = auth_uid);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_uid);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = auth_uid);

-- Create index for faster lookups
CREATE INDEX idx_profiles_auth_uid ON profiles(auth_uid);
```

## 2. Configure GitHub OAuth

1. Go to: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/auth/providers
2. Enable GitHub provider
3. Add your GitHub OAuth credentials:
   - **Client ID**: `Ov23likgTKlrOqhvIolX`
   - **Client Secret**: `d68d756514344e5f03a7aaca562d18ceb21554b6`
4. Add callback URL in GitHub OAuth App:
   - `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`

## 3. Test the Flow

1. **Landing Page** → Click "Login with GitHub"
2. **GitHub OAuth** → Authorize the app
3. **Survey Page** → Fill in remaining details (pre-filled with GitHub data)
4. **App** → Your profile is saved and visible everywhere!

## 4. Verify Data

Check your Supabase dashboard:
- **Auth → Users**: See authenticated users
- **Table Editor → profiles**: See saved profile data

## Done! 🎉

Your app now:
- ✅ Authenticates users via GitHub
- ✅ Saves survey data to Supabase
- ✅ Loads profile data on login
- ✅ Persists sessions
- ✅ Shows profile data throughout the app
