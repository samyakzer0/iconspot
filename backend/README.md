# IconSpot Backend

Backend API server for the IconSpot icon generation platform.

## Features

- **Perplexity Pro API Integration**: Enhances user prompts for better icon generation
- **Nano Banana API Integration**: Generates multiple icon variations
- **Remove.bg API Integration**: Removes backgrounds from generated icons
- **Icon Management**: Temporary storage and retrieval of generated icons
- **File Downloads**: Download processed icons in PNG format

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   NANO_BANANA_API_KEY=your_nano_banana_api_key_here
   REMOVE_BG_API_KEY=your_remove_bg_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Generate Icon Variations
```http
POST /api/icons/generate
Content-Type: application/json

{
  "style": "glass|neon|cyberpunk|minimal",
  "context": "icon description"
}
```

### Generate High-Quality Icon
```http
POST /api/icons/generate-high-quality
Content-Type: application/json

{
  "iconId": "icon_session_id",
  "selectedVariationIndex": 0
}
```

### Download Icon
```http
GET /api/icons/download/:iconId
```

## API Keys Required

1. **Perplexity Pro API Key**: Get from [Perplexity AI](https://www.perplexity.ai/)
2. **Nano Banana API Key**: Get from [Nano Banana](https://nanobanana.com) (replace with actual service)
3. **Remove.bg API Key**: Get from [Remove.bg](https://www.remove.bg/)

## Development Notes

- The server runs on port 3001 by default
- CORS is configured for `http://localhost:5173` (Vite dev server)
- Icons are temporarily stored in memory (use database for production)
- Error handling includes fallbacks for development

## Project Structure

```
backend/
├── controllers/
│   └── iconController.js      # Main API logic
├── routes/
│   └── iconRoutes.js          # API routes
├── services/
│   ├── perplexityService.js   # Perplexity API integration
│   ├── nanoBananaService.js   # Icon generation service
│   └── removeBgService.js     # Background removal service
├── server.js                  # Main server file
├── package.json
└── README.md
