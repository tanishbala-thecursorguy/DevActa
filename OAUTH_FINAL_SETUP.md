# 🚀 FINAL OAuth Setup - DO THIS NOW!

## ⚡ URGENT: Complete These 3 Steps

---

## Step 1: Setup Database (1 minute)

1. Go to: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/sql/new
2. Copy ALL the SQL from `SUPABASE_OAUTH_SETUP.sql`
3. Paste and click **"Run"**
4. Verify tables created: Go to **Table Editor** → You should see `profiles` and `surveys`

---

## Step 2: Configure GitHub OAuth in Supabase (1 minute)

1. Go to: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/auth/providers
2. Find **"GitHub"** in the list
3. Click to expand
4. Toggle **"Enable"** to ON
5. Enter these credentials:
   ```
   Client ID: v23likgTKlrOqhvIolX
   Client Secret: d68d756514344e5f03a7aaca562d18ceb21554b6
   ```
6. Verify **Callback URL** shows: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
7. Click **"Save"**

---

## Step 3: Configure LinkedIn OAuth in Supabase (1 minute)

1. **FIRST** - Create LinkedIn App (if not done):
   - Go to: https://www.linkedin.com/developers/apps
   - Create app
   - Request "Sign In with LinkedIn using OpenID Connect"
   - Add redirect URL: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret

2. **THEN** - Configure in Supabase:
   - Go to: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob/auth/providers
   - Find **"LinkedIn (OIDC)"**
   - Toggle **"Enable"** to ON
   - Paste your LinkedIn Client ID and Secret
   - Click **"Save"**

---

## Step 4: Add Environment Variables to Vercel (1 minute)

1. Go to: https://vercel.com/tanishbala-thecursorguy-s-projects/devacta/settings/environment-variables
2. Add these variables (click "Add" for each):

```
VITE_SUPABASE_AUTH_URL=https://cqaxrwoulcvptgsqwwob.supabase.co
VITE_SUPABASE_AUTH_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYXhyd291bGN2cHRnc3F3d29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDIxNDksImV4cCI6MjA3NTIxODE0OX0.2fF00Xk5Dsx8ezYiDWXLhDkXonGQDXR3Y1udi7MrLz8

VITE_SUPABASE_CENTRAL_URL=https://nwcaqyduvujhaawsrpxe.supabase.co
VITE_SUPABASE_CENTRAL_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Y2FxeWR1dnVqaGFhd3NycHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDEzMDksImV4cCI6MjA3NTIxNzMwOX0.cuNo-tQISVKut4g8w6jgbNUeTUTWtzqICXwPj3qyvnA

VITE_SUPABASE_POSTS_URL=https://tpiiwaensbimajaouvyi.supabase.co
VITE_SUPABASE_POSTS_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaWl3YWVuc2JpbWFqYW91dnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDE3MjIsImV4cCI6MjA3NTIxNzcyMn0.29JgxFDCSchWkTUVn233EZKEb-ZNzzLakO5UzunsHDk

VITE_SUPABASE_GAMES_URL=https://aneoosskouaiunfjbobq.supabase.co
VITE_SUPABASE_GAMES_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZW9vc3Nrb3VhaXVuZmpib2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDE4OTMsImV4cCI6MjA3NTIxNzg5M30.9EtW4OUt2XVgDUgLi7r_r8zaEXft2YGo8zTpuSPA3sY

VITE_SUPABASE_CHALLENGES_URL=https://kjqyxqpqvwxictovryvl.supabase.co
VITE_SUPABASE_CHALLENGES_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcXl4cXBxdnd4aWN0b3ZyeXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDIwMzgsImV4cCI6MjA3NTIxODAzOH0.HMOg25t-mPU8HHMrusV7TmLVX5kHw03RgLlDF42iFR8

VITE_APP_URL=https://devacta.vercel.app
```

3. Make sure to select **"Production"** for each variable
4. Click **"Save"**

---

## Step 5: Redeploy (30 seconds)

1. Go to: https://vercel.com/tanishbala-thecursorguy-s-projects/devacta/deployments
2. Click **"Redeploy"** on the latest deployment
3. Wait 2 minutes for build to complete

---

## ✅ Test It!

1. Visit: https://devacta.vercel.app
2. Click **"Get Started"**
3. Click **"Continue with GitHub"**
4. You should be redirected to GitHub OAuth
5. After authorization, you'll be redirected back and logged in!

---

## 🎯 What This Does:

- ✅ GitHub OAuth fully working
- ✅ LinkedIn OAuth ready (once you add credentials)
- ✅ Profile auto-created on login
- ✅ Realtime sync across all Supabase projects
- ✅ Session persistence
- ✅ All environment variables configured

---

## 📝 GitHub OAuth Credentials (Already Configured):

```
Client ID: v23likgTKlrOqhvIolX
Client Secret: d68d756514344e5f03a7aaca562d18ceb21554b6
Callback URL: https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback
```

---

## 🔗 LinkedIn OAuth Callback URL:

```
https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback
```

Use this when creating your LinkedIn app!

---

**DO THESE STEPS NOW AND YOUR SITE WILL WORK!** 🚀
