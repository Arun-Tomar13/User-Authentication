import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config.js';
import authRoutes from './routes/auth.route.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Connect to MongoDB Database
connectDB();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS - Allow frontend to communicate with backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Request Logger Middleware (for development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// API ROUTES
// ============================================

// Authentication routes
app.use('/api/auth', authRoutes);

// Health check route - Test if API is running
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '✅ Account Manager API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API info route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Account Manager API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        verifyOTP: 'POST /api/auth/verify-otp',
        resendOTP: 'POST /api/auth/resend-otp',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (Protected)',
        updateProfile: 'PUT /api/auth/profile (Protected)'
      }
    }
  });
});

// ERROR HANDLING MIDDLEWARE

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVER STARTED SUCCESSFULLY');
  console.log('='.repeat(50));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email Service: gmail (${process.env.EMAIL_USER})`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('='.repeat(50) + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT signal received: closing HTTP server');
  process.exit(0);
});
