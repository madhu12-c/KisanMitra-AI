# Deployment Guide - KisanMitra AI

## Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Groq API key from https://console.groq.com

### Step 1: Push to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push to GitHub:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 3: Add Environment Variable

1. In Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key from https://console.groq.com
   - **Environment**: Production, Preview, Development (select all)

3. Click **Save**

### Step 4: Deploy

1. Vercel will automatically deploy
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Step 5: Verify

1. Visit your deployed URL
2. Test the language toggle
3. Complete a profile and check recommendations
4. Verify AI explanations are working

## Environment Variables

### Required
- `GROQ_API_KEY` - Your Groq API key for AI explanations

### Optional
- `NODE_ENV` - Set to `production` (auto-set by Vercel)

## Build Configuration

- **Framework**: Next.js 14
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript has no errors: `npm run build`
- Check Vercel build logs for specific errors

### API Key Not Working
- Verify `GROQ_API_KEY` is set in Vercel Environment Variables
- Ensure it's added to all environments (Production, Preview, Development)
- Redeploy after adding environment variable

### AI Explanations Not Loading
- Check Vercel function logs for API errors
- Verify Groq API key is valid
- Check rate limits on Groq account

## Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Set environment variable
# Create .env.local with:
# GROQ_API_KEY=your_key_here

# Test production build locally
npm run build
npm start

# Visit http://localhost:3000
```

## Production Checklist

- ✅ Environment variables set in Vercel
- ✅ Build completes successfully
- ✅ All routes work (`/` and `/analyze`)
- ✅ Language toggle works
- ✅ AI explanations generate correctly
- ✅ No console errors in browser
- ✅ Responsive design works on mobile

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test API key directly with Groq
