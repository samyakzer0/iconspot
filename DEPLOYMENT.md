# IconSpot Deployment Guide

## 🚀 Current Deployment Status

✅ **Backend**: Already deployed at `https://iconspot-2.onrender.com/`
✅ **Frontend**: Deployed at `https://iconspot.vercel.app/`

## Backend Deployment (Render)

Your backend is already deployed! If you need to redeploy or update:

### Update Environment Variables in Render Dashboard

In your Render dashboard (`https://iconspot-2.onrender.com/`), update these environment variables:

```bash
NODE_ENV=production
FRONTEND_URL=https://iconspot.vercel.app
PERPLEXITY_API_KEY=your_perplexity_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

## Frontend Deployment (Vercel)

Your frontend is already deployed! If you need to redeploy:

### Update Environment Variables in Vercel Dashboard

In your Vercel dashboard (`https://iconspot.vercel.app/`), ensure this variable is set:

```bash
VITE_API_URL=https://iconspot-2.onrender.com
```

## 🔧 Recent Fixes Applied

✅ **CORS Configuration**: Updated to accept requests from `https://iconspot.vercel.app`
✅ **API Configuration**: Frontend now points to `https://iconspot-2.onrender.com`
✅ **Environment Variables**: Configured for production deployment

## 🚨 Required: Set Your API Keys

You need to set these API keys in your Render dashboard:

1. **Perplexity API Key**:
   - Get from: [perplexity.ai](https://perplexity.ai)
   - Set as: `PERPLEXITY_API_KEY`

2. **Google AI API Key**:
   - Get from: [Google AI Studio](https://aistudio.google.com)
   - Set as: `GOOGLE_API_KEY`

3. **Remove.bg API Key**:
   - Get from: [remove.bg](https://remove.bg)
   - Set as: `REMOVE_BG_API_KEY`

## 🧪 Testing Your Deployment

1. **Backend Health Check**:
   - Visit: `https://iconspot-2.onrender.com/health`
   - Should return: `{"status": "OK", "timestamp": "..."}`

2. **Frontend Test**:
   - Visit: `https://iconspot.vercel.app/`
   - Try generating an icon to test the full workflow

## 🔍 Troubleshooting

If you encounter issues:

1. **CORS Errors**: Check that `FRONTEND_URL` in Render matches your Vercel URL exactly
2. **API Key Errors**: Verify all API keys are set correctly in Render dashboard
3. **Build Issues**: Check the build logs in Render/Vercel dashboards

## 📞 Support

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard