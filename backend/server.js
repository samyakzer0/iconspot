import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import iconRoutes from './routes/iconRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://iconspot.vercel.app',
      'https://iconspot-2.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // Exact match
      if (allowedOrigin === origin) return true;

      // Handle trailing slash differences for Vercel
      if (allowedOrigin.endsWith('/') && origin === allowedOrigin.slice(0, -1)) return true;
      if (!allowedOrigin.endsWith('/') && origin === allowedOrigin + '/') return true;

      return false;
    });

    if (isAllowed) {
      return callback(null, true);
    } else {
      console.log('Blocked CORS request from origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/icons', iconRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://iconspot.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  });
});

// Debug endpoint to check environment
app.get('/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    hasGoogleApiKey: !!process.env.GOOGLE_API_KEY,
    hasPerplexityApiKey: !!process.env.PERPLEXITY_API_KEY,
    hasRemoveBgApiKey: !!process.env.REMOVE_BG_API_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    corsOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://iconspot.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 IconSpot backend server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});