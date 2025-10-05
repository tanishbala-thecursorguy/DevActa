# OAuth Quick Setup - Get It Working in 5 Minutes!

## ⚠️ IMPORTANT: OAuth Won't Work Until You Complete These Steps

Your code is ready, but you need to configure the OAuth providers in Supabase.

---

## 🚀 Step 1: Setup GitHub OAuth (2 minutes)

### Create GitHub OAuth App:

1. Go to: **https://github.com/settings/developers**
2. Click **"New OAuth App"**
3. Fill in:
   ```
   Application name: DevActa
   Homepage URL: http://localhost:3000
   Authorization callback URL: https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback
   ```
4. Click **"Register application"**
5. **Copy the Client ID**
6. Click **"Generate a new client secret"** → **Copy it immediately!**

### Configure in Supabase:

1. Go to: **https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/auth/providers**
2. Find **GitHub** in the list
3. Click to expand
4. Toggle **"Enable"** to ON
5. Paste your **Client ID**
6. Paste your **Client Secret**
7. Click **"Save"**

---

## 🔗 Step 2: Setup LinkedIn OAuth (3 minutes)

### Create LinkedIn App:

1. Go to: **https://www.linkedin.com/developers/apps**
2. Click **"Create app"**
3. Fill in:
   ```
   App name: DevActa
   LinkedIn Page: (select or create one)
   Privacy policy URL: https://devacta.vercel.app/privacy
   App logo: (upload your logo)
   ```
4. Check the legal agreement
5. Click **"Create app"**

### Configure LinkedIn App:

1. Go to **"Auth"** tab
2. Under **"OAuth 2.0 settings"**:
   - Click **"Add redirect URL"**
   - Enter: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
   - Click **"Update"**
3. Copy your **Client ID** and **Client Secret**

### Request API Access:

1. Go to **"Products"** tab
2. Find **"Sign In with LinkedIn using OpenID Connect"**
3. Click **"Request access"** (usually instant approval)

### Configure in Supabase:

1. Go to: **https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/auth/providers**
2. Find **LinkedIn (OIDC)** in the list
3. Click to expand
4. Toggle **"Enable"** to ON
5. Paste your **Client ID**
6. Paste your **Client Secret**
7. Click **"Save"**

---

## 🗄️ Step 3: Setup Database Tables (2 minutes)

### Run SQL in Supabase:

1. Go to: **https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/sql/new**
2. Copy this SQL and paste it:

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
```

3. Click **"Run"**
4. Verify tables created: Go to **Table Editor** → You should see `profiles` and `surveys`

---

## ✅ Step 4: Test It!

1. Make sure your dev server is running:
   ```bash
   cd "DevActa Web Application Design"
   npm run dev
   ```

2. Open: **http://localhost:3000**

3. Click **"Get Started"**

4. Click **"Continue with GitHub"**

5. You should be redirected to GitHub → Authorize → Redirected back

6. Check Supabase: Go to **Table Editor** → **profiles** → You should see your profile!

---

## 🐛 Troubleshooting

### "Error: Invalid OAuth state"
- Clear your browser cookies
- Try incognito mode
- Verify callback URL is exactly: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`

### "Error: Redirect URI mismatch"
- Double-check the callback URL in GitHub/LinkedIn settings
- No trailing slash
- Must be exact match

### "Profile not created"
- Check browser console for errors
- Verify RLS policies are enabled
- Check Supabase logs: **Dashboard → Logs → Auth Logs**

### LinkedIn not working
- Make sure you requested "Sign In with LinkedIn using OpenID Connect"
- Use `linkedin_oidc` provider (already configured in code)
- Verify redirect URL is added in LinkedIn app

---

## 📝 What Happens When User Logs In:

1. ✅ User clicks "Continue with GitHub/LinkedIn"
2. ✅ OAuth popup/redirect opens
3. ✅ User authorizes app
4. ✅ Redirects back with auth token
5. ✅ `App.tsx` detects auth state change
6. ✅ `upsertProfile()` creates profile in Supabase 1
7. ✅ Profile synced to Central Store (Supabase 2)
8. ✅ User redirected to survey page
9. ✅ After survey, user enters main app

---

## 🎯 Production Setup

When deploying to Vercel:

1. **Update GitHub OAuth App**:
   - Add production URL: `https://devacta.vercel.app`
   - Callback URL stays the same

2. **Update LinkedIn App**:
   - Add production URL to authorized domains
   - Callback URL stays the same

3. **Add Environment Variables in Vercel**:
   - All `VITE_*` variables from your `.env` file

---

## ✨ You're Done!

OAuth is now fully working! Users can sign in with GitHub and LinkedIn, and their profiles will be automatically created and synced across all Supabase projects.

**Next**: Setup the other 4 Supabase projects using `SUPABASE_SCHEMAS.md`
