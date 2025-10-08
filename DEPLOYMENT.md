# IconSpot Deployment Guide

This guide explains how to deploy IconSpot to Vercel (frontend) and Render (backend).

## 🚀 Current Deployment Status

**✅ Backend Already Deployed:**
- **URL**: https://iconspot-2.onrender.com/
- **Status**: Active and running
- **Health Check**: https://iconspot-2.onrender.com/health

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. **Create a Vercel Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Connect your GitHub repository
   - Select the repository containing your IconSpot frontend code

3. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables in Vercel

In your Vercel dashboard, go to your project's settings and add:

```bash
VITE_API_URL=https://iconspot-2.onrender.com
```

### Step 3: Deploy

- Click "Deploy"
- Vercel will automatically build and deploy your frontend
- Note the provided URL (e.g., `https://your-app.vercel.app`)

## Backend Configuration (Render)

Your backend is already deployed at https://iconspot-2.onrender.com/

### Environment Variables (Already Set in Render):

```bash
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app  # Update this after Vercel deployment
PERPLEXITY_API_KEY=your_perplexity_api_key
GOOGLE_API_KEY=your_google_api_key
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

## Post-Deployment Steps

### Update CORS Configuration

After your Vercel deployment is complete:

1. **Get your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Update Render Environment Variable**:
   - Go to your Render dashboard
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Trigger a manual redeploy if needed

### API Keys Setup

You'll need to set these API keys in your Render dashboard:

1. **Perplexity API Key**:
   - Sign up at [perplexity.ai](https://perplexity.ai)
   - Navigate to API settings
   - Generate a new API key

2. **Google AI API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com)
   - Create a new API key
   - Enable Gemini API access

3. **Remove.bg API Key**:
   - Sign up at [remove.bg](https://remove.bg)
   - Go to API settings
   - Generate a new API key

## Testing Your Deployment

1. **Backend Health Check**:
   ```
   https://iconspot-2.onrender.com/health
   ```

2. **Frontend Test**:
   ```
   https://your-app.vercel.app
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` in Render matches your Vercel deployment URL exactly
   - Check that the URL includes `https://`

2. **API Key Errors**:
   - Verify all API keys are correctly set in Render dashboard
   - Check API key formats and ensure they're not expired

3. **Build Failures**:
   - Ensure all dependencies are in `package-lock.json`
   - Check Node.js version compatibility

## File Structure

```
IconSpot/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── lib/
│   │   └── api.js         # API configuration
│   └── pages/             # Page components
├── backend/               # Backend Node.js app
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   └── server.js         # Main server file
├── render.yaml           # Render deployment config
├── vercel.json          # Vercel deployment config
└── package.json         # Frontend dependencies
```

## Support

For issues specific to deployment platforms:
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)