# OAuth Setup Guide - GitHub & LinkedIn

Complete step-by-step guide to configure GitHub and LinkedIn OAuth for DevActa.

---

## 🔐 Supabase Configuration

**Supabase Auth URL**: https://cqaxrwoulcvptgsqwwob.supabase.co  
**Callback URL**: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`

---

## 1️⃣ GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to **GitHub Settings**: https://github.com/settings/developers
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `DevActa`
   - **Homepage URL**: `https://devacta.vercel.app` (or `http://localhost:3000` for development)
   - **Application description**: `DevActa - Developer Community Platform`
   - **Authorization callback URL**: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
4. Click **"Register application"**

### Step 2: Get Client ID and Secret

After creating the app, you'll see:
- **Client ID**: (copy this)
- **Client Secret**: Click **"Generate a new client secret"** → Copy it immediately (you won't see it again!)

### Step 3: Configure in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob
2. Navigate to **Authentication** → **Providers**
3. Find **GitHub** and click to expand
4. Enable GitHub provider
5. Enter your credentials:
   - **Client ID**: (paste from GitHub)
   - **Client Secret**: (paste from GitHub)
6. The **Callback URL** should already be: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
7. Click **"Save"**

### Step 4: Test GitHub Login

```typescript
// This is already in your authService.ts
import { supabaseAuth } from '../lib/supabase';

async function signInWithGitHub() {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin,
    },
  });
  
  if (error) console.error('Error:', error);
  return data;
}
```

---

## 2️⃣ LinkedIn OAuth Setup

### Step 1: Create LinkedIn App

1. Go to **LinkedIn Developers**: https://www.linkedin.com/developers/apps
2. Click **"Create app"**
3. Fill in the details:
   - **App name**: `DevActa`
   - **LinkedIn Page**: (Select your company page or create one)
   - **Privacy policy URL**: `https://devacta.vercel.app/privacy` (create this page)
   - **App logo**: Upload your DevActa logo
4. Check the **Legal agreement** checkbox
5. Click **"Create app"**

### Step 2: Configure OAuth Settings

1. After creating the app, go to the **"Auth"** tab
2. Under **"OAuth 2.0 settings"**:
   - **Redirect URLs**: Add `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
   - Click **"Add redirect URL"** to save
3. Under **"Application credentials"**:
   - **Client ID**: (copy this)
   - **Client Secret**: (copy this - click "Show" if hidden)

### Step 3: Request API Access

1. Go to the **"Products"** tab
2. Request access to:
   - ✅ **Sign In with LinkedIn using OpenID Connect** (required)
   - ✅ **Share on LinkedIn** (optional, for posting features)
3. Wait for approval (usually instant for Sign In with LinkedIn)

### Step 4: Configure in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cqaxrwoulcvptgsqwwob
2. Navigate to **Authentication** → **Providers**
3. Find **LinkedIn** and click to expand
4. Enable LinkedIn provider
5. Enter your credentials:
   - **Client ID**: (paste from LinkedIn)
   - **Client Secret**: (paste from LinkedIn)
6. The **Callback URL** should already be: `https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback`
7. Click **"Save"**

### Step 5: Update Auth Service

Update your `authService.ts` to include LinkedIn:

```typescript
// Sign in with LinkedIn
export async function signInWithLinkedIn() {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}
```

---

## 3️⃣ Update Login Page UI

Add LinkedIn button to your login page:

```typescript
// In FuturisticLoginPage.tsx or LoginPage.tsx

import { signInWithGitHub, signInWithLinkedIn } from '../services/authService';

// GitHub Login Button
<button
  onClick={signInWithGitHub}
  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
  Continue with GitHub
</button>

// LinkedIn Login Button
<button
  onClick={signInWithLinkedIn}
  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#0A66C2] text-white rounded-md hover:bg-[#004182]"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
  Continue with LinkedIn
</button>
```

---

## 4️⃣ Environment Variables

Update your `.env` file:

```bash
# Supabase 1 - Authentication
VITE_SUPABASE_AUTH_URL=https://cqaxrwoulcvptgsqwwob.supabase.co
VITE_SUPABASE_AUTH_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYXhyd291bGN2cHRnc3F3d29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDIxNDksImV4cCI6MjA3NTIxODE0OX0.2fF00Xk5Dsx8ezYiDWXLhDkXonGQDXR3Y1udi7MrLz8

# App URLs
VITE_APP_URL=http://localhost:3000
VITE_APP_URL_PRODUCTION=https://devacta.vercel.app
```

---

## 5️⃣ Testing Checklist

### GitHub OAuth:
- [ ] GitHub OAuth app created
- [ ] Client ID and Secret configured in Supabase
- [ ] Callback URL matches exactly
- [ ] Test login from localhost
- [ ] Test login from Vercel deployment
- [ ] Profile data is captured (username, avatar, email)

### LinkedIn OAuth:
- [ ] LinkedIn app created
- [ ] Sign In with LinkedIn product approved
- [ ] Client ID and Secret configured in Supabase
- [ ] Redirect URL added in LinkedIn app settings
- [ ] Test login from localhost
- [ ] Test login from Vercel deployment
- [ ] Profile data is captured (name, email, profile picture)

### Profile Creation:
- [ ] User profile created in `profiles` table after login
- [ ] Profile synced to `central_profiles` in Supabase 2
- [ ] GitHub/LinkedIn data properly stored
- [ ] Profile picture URL saved correctly

---

## 6️⃣ Common Issues & Solutions

### Issue: "Redirect URI mismatch"
**Solution**: Make sure the callback URL in GitHub/LinkedIn exactly matches:
```
https://cqaxrwoulcvptgsqwwob.supabase.co/auth/v1/callback
```
No trailing slash, exact match required.

### Issue: "Invalid client credentials"
**Solution**: Double-check Client ID and Secret are copied correctly. Regenerate if needed.

### Issue: LinkedIn login not working
**Solution**: 
1. Make sure "Sign In with LinkedIn using OpenID Connect" is approved
2. Use `linkedin_oidc` as provider (not `linkedin`)
3. Verify redirect URL is added in LinkedIn app settings

### Issue: Profile not created after login
**Solution**: Check the `upsertProfile` function in `authService.ts` is being called after successful OAuth.

---

## 7️⃣ Security Best Practices

1. **Never commit secrets**: Keep `.env` in `.gitignore`
2. **Use different apps**: Create separate OAuth apps for development and production
3. **Rotate secrets**: Regularly rotate Client Secrets
4. **Monitor usage**: Check OAuth app usage in GitHub/LinkedIn dashboards
5. **Enable 2FA**: Enable two-factor authentication on your GitHub/LinkedIn accounts

---

## 8️⃣ Production Deployment

When deploying to Vercel:

1. **Add environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `VITE_*` variables from your `.env` file

2. **Update OAuth redirect URLs**:
   - Add production URL to GitHub OAuth app: `https://devacta.vercel.app`
   - Add production callback to LinkedIn app
   - Keep localhost URLs for development

3. **Test thoroughly**:
   - Test GitHub login on production
   - Test LinkedIn login on production
   - Verify profile creation works
   - Check realtime sync to central store

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs → Auth Logs
2. Check browser console for errors
3. Verify all URLs match exactly (no typos)
4. Test with a different browser/incognito mode

---

**Setup Complete!** 🎉

Users can now sign in with both GitHub and LinkedIn, and their profiles will be automatically created and synced across all Supabase projects.
