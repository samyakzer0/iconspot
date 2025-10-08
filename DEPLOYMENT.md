# IconSpot Deployment Guide

This guide explains how to deploy IconSpot to Vercel (frontend) and Render (backend).

## Backend Deployment (Render)

### Step 1: Deploy to Render

1. **Create a Render Account**: Sign up at [render.com](https://render.com)

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the repository containing your IconSpot backend code

3. **Configure Service**:
   - **Name**: `iconspot-backend` (or your preferred name)
   - **Runtime**: `Node.js`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Port**: `3001`

### Step 2: Set Environment Variables in Render

In your Render dashboard, go to your service's environment variables and add:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
PERPLEXITY_API_KEY=your_perplexity_api_key
GOOGLE_API_KEY=your_google_api_key
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

### Step 3: Deploy

- Click "Create Web Service"
- Render will automatically build and deploy your backend
- Note the provided URL (e.g., `https://your-backend.onrender.com`)

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
VITE_API_URL=https://your-render-backend-url.onrender.com
```

### Step 3: Deploy

- Click "Deploy"
- Vercel will automatically build and deploy your frontend
- Note the provided URL (e.g., `https://your-app.vercel.app`)

## Post-Deployment Steps

### Update CORS Configuration

After deployment, update your Render backend's `FRONTEND_URL` environment variable with your actual Vercel URL:

```
FRONTEND_URL=https://your-app.vercel.app
```

### Update Vercel Environment Variable

Update your Vercel project's `VITE_API_URL` with your actual Render backend URL:

```
VITE_API_URL=https://your-backend.onrender.com
```

## API Keys Setup

You'll need to obtain these API keys for full functionality:

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

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` in Render matches your Vercel deployment URL
   - Check that the URL includes `https://`

2. **API Key Errors**:
   - Verify all API keys are correctly set in both Render and Vercel
   - Check API key formats and ensure they're not expired

3. **Build Failures**:
   - Ensure all dependencies are in `package-lock.json`
   - Check Node.js version compatibility

### Health Check

- Backend: Visit `https://your-backend.onrender.com/health`
- Frontend: Visit `https://your-app.vercel.app`

## Cost Optimization

- **Render**: Consider upgrading to paid plan for better performance
- **API Costs**: Monitor usage of Perplexity, Google AI, and Remove.bg APIs
- **Database**: Consider adding a database for production icon storage

## Support

For issues specific to deployment platforms:
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)