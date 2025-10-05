# DevActa Quick Start Guide

Get your DevActa application up and running in 30 minutes!

---

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- 5 Supabase projects created (already done ✅)
- GitHub account
- LinkedIn account

---

## 🚀 Step-by-Step Setup

### 1. Clone & Install (5 minutes)

```bash
cd "DevActa Web Application Design"
npm install
```

### 2. Setup Environment Variables (2 minutes)

```bash
# Copy the example env file
cp env.example .env

# The .env file is already configured with all Supabase URLs and keys
# No changes needed unless you want to customize
```

### 3. Setup Supabase Databases (10 minutes)

Open `SUPABASE_SCHEMAS.md` and for each of the 5 Supabase projects:

#### Supabase 1 - Auth & Profiles
1. Go to: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob
2. Click **SQL Editor** → **New Query**
3. Copy the **Supabase 1** schema from `SUPABASE_SCHEMAS.md`
4. Paste and click **Run**
5. Go to **Database** → **Replication** → Enable for `profiles` and `surveys`

#### Supabase 2 - Central Store
1. Go to: https://supabase.com/dashboard/project/nwcaqyduvujhaawsrpxe
2. Click **SQL Editor** → **New Query**
3. Copy the **Supabase 2** schema from `SUPABASE_SCHEMAS.md`
4. Paste and click **Run**
5. Enable replication for `central_profiles` and `acta_ledger`

#### Supabase 3 - Posts
1. Go to: https://supabase.com/dashboard/project/tpiiwaensbimajaouvyi
2. Click **SQL Editor** → **New Query**
3. Copy the **Supabase 3** schema from `SUPABASE_SCHEMAS.md`
4. Paste and click **Run**
5. Enable replication for `posts` and `reactions`

#### Supabase 4 - Games
1. Go to: https://supabase.com/dashboard/project/aneoosskouaiunfjbobq
2. Click **SQL Editor** → **New Query**
3. Copy the **Supabase 4** schema from `SUPABASE_SCHEMAS.md`
4. Paste and click **Run**
5. Enable replication for `leaderboard` and `trophies`

#### Supabase 5 - Challenges
1. Go to: https://supabase.com/dashboard/project/kjqyxqpqvwxictovryvl
2. Click **SQL Editor** → **New Query**
3. Copy the **Supabase 5** schema from `SUPABASE_SCHEMAS.md`
4. Paste and click **Run**
5. Enable replication for `challenges` and `challenge_participants`

### 4. Setup OAuth (10 minutes)

Follow the detailed instructions in `OAUTH_SETUP_GUIDE.md`:

#### GitHub OAuth:
1. Go to: https://github.com/settings/developers
2. Create new OAuth App
3. Set callback URL: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. Add to Supabase 1: **Authentication** → **Providers** → **GitHub**

#### LinkedIn OAuth:
1. Go to: https://www.linkedin.com/developers/apps
2. Create new app
3. Request "Sign In with LinkedIn using OpenID Connect"
4. Add redirect URL: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
5. Copy Client ID and Secret
6. Add to Supabase 1: **Authentication** → **Providers** → **LinkedIn**

### 5. Run Development Server (1 minute)

```bash
npm run dev
```

Your app will open at: http://localhost:3000

### 6. Test Everything (5 minutes)

- [ ] Landing page loads
- [ ] Click "Get Started" → Login page appears
- [ ] Click "Sign in with GitHub" → OAuth flow works
- [ ] Profile is created (check Supabase 1 → profiles table)
- [ ] Central profile synced (check Supabase 2 → central_profiles table)
- [ ] Navigate to Games section
- [ ] Try playing a game
- [ ] Check ACTA balance updates

---

## 🎮 Features Overview

### Authentication
- ✅ GitHub OAuth login
- ✅ LinkedIn OAuth login
- ✅ Automatic profile creation
- ✅ Cross-project profile sync

### ACTA Cards System
- Earn ACTA cards from reactions:
  - 😊 Smile = +5 ACTA
  - 😐 Numb = -1 ACTA
  - 😢 Sad = -1 ACTA
- Consume ACTA to play games
- Real-time balance updates

### Games
- 16 playable games
- Each game costs ACTA cards to play
- Win games = earn 3 trophies
- 1-minute time limit per game
- Real-time leaderboard

### Posts & Explore
- Create posts with repo links
- React to posts (smile/numb/sad)
- Reactions award ACTA to post owner
- Real-time feed updates

### Challenges & Hackathons
- Create challenges
- Join challenges (max players limit)
- Live participant count
- Discord/Meet integration

---

## 📊 Database Structure

```
Supabase 1 (Auth)
├── profiles (user profiles)
└── surveys (onboarding data)

Supabase 2 (Central)
├── central_profiles (canonical user data)
├── acta_ledger (transaction log)
└── sync_log (cross-project events)

Supabase 3 (Posts)
├── posts (user posts)
└── reactions (post reactions)

Supabase 4 (Games)
├── games_played (game history)
├── trophies (user trophies)
└── leaderboard (rankings)

Supabase 5 (Challenges)
├── challenges (hackathons/challenges)
└── challenge_participants (joiners)
```

---

## 🔄 Data Flow

```
1. User Login (GitHub/LinkedIn)
   ↓
2. Profile created in Supabase 1
   ↓
3. Profile synced to Supabase 2 (Central)
   ↓
4. User creates post in Supabase 3
   ↓
5. Others react → ACTA cards awarded (Supabase 2)
   ↓
6. User plays game → ACTA consumed (Supabase 2)
   ↓
7. User wins → Trophies awarded (Supabase 4)
   ↓
8. Leaderboard updates (real-time)
```

---

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### OAuth redirect mismatch
- Verify callback URL is exactly: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
- No trailing slash
- Check both GitHub/LinkedIn app settings AND Supabase settings

### Profile not created after login
- Check browser console for errors
- Verify RLS policies are enabled
- Check Supabase logs: Dashboard → Logs → Auth Logs

### ACTA balance not updating
- Verify Supabase 2 RPC functions are created
- Check `rpc_add_acta_cards` and `rpc_consume_acta_cards` exist
- Enable realtime for `central_profiles` table

### Games not starting
- Verify user has sufficient ACTA balance
- Check `rpc_consume_acta_cards` is working
- Look for errors in browser console

---

## 📦 Deployment to Vercel

```bash
# Already configured! Just push to GitHub
git add .
git commit -m "feat: complete setup"
git push

# Vercel will auto-deploy
# Your site: https://devacta.vercel.app
```

### Add Environment Variables in Vercel:
1. Go to Vercel Dashboard → Project Settings
2. Click **Environment Variables**
3. Add all `VITE_*` variables from your `.env` file
4. Redeploy

---

## 🎯 Next Steps

1. **Customize UI**: Update colors, fonts, and styling
2. **Add more games**: Extend the games library
3. **Create challenges**: Test the challenges feature
4. **Invite users**: Share your deployed link
5. **Monitor usage**: Check Supabase analytics

---

## 📚 Documentation

- `SUPABASE_SCHEMAS.md` - Complete database schemas
- `OAUTH_SETUP_GUIDE.md` - Detailed OAuth setup
- `DEPLOYMENT.md` - Vercel deployment guide
- `README.md` - Project overview

---

## 🆘 Need Help?

- Check Supabase logs for errors
- Review browser console
- Verify all environment variables are set
- Ensure all 5 Supabase projects have tables created
- Test OAuth apps in GitHub/LinkedIn dashboards

---

**You're all set!** 🎉

Start building, gaming, and connecting with the developer community!
