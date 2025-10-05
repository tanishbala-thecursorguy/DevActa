# DevActa - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Navigate to the project directory**:
```bash
cd "DevActa Web Application Design"
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**:
   - Connect your GitHub account
   - Select repository: `tanishbala-thecursorguy/global-hackathon-v1`
   - Select branch: `frontend`

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `DevActa Web Application Design`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Click "Deploy"**

### Option 3: One-Click Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tanishbala-thecursorguy/global-hackathon-v1&project-name=devacta&repository-name=devacta&root-directory=DevActa%20Web%20Application%20Design)

## 📋 Pre-Deployment Checklist

✅ All files committed and pushed to GitHub
✅ `vercel.json` configuration file created
✅ `.vercelignore` file created
✅ Build command configured in `package.json`
✅ All dependencies installed

## 🔧 Project Configuration

- **Framework**: Vite + React + TypeScript
- **Build Output**: `build/` directory
- **Node Version**: 18.x or higher
- **Package Manager**: npm

## 🌐 After Deployment

Once deployed, Vercel will provide you with:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each branch/PR
- **Analytics Dashboard**: Monitor performance
- **Automatic HTTPS**: SSL certificate included

## 🔄 Automatic Deployments

Vercel will automatically deploy:
- **Production**: When you push to `frontend` branch
- **Preview**: When you create a pull request

## 📱 Custom Domain (Optional)

To add a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your domain and follow DNS instructions

## 🐛 Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify build command works locally: `npm run build`
4. Check Node.js version compatibility

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create an issue in your repository
- Vercel Support: https://vercel.com/support

---

**Built with ❤️ by DevActa Team**
*Powered by Acta*
