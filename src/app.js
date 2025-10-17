const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const { formatSuccessResponse } = require('./utils/responseFormatter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet: Set security HTTP headers
app.use(helmet());

// CORS: Configure cross-origin requests
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://todo-frontend.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate Limiting: Prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Terlalu banyak request dari IP ini, silakan coba lagi nanti',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// ============================================
// Body Parser Middleware
// ============================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// ============================================
// Logging Middleware
// ============================================

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ============================================
// Routes
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  const response = formatSuccessResponse(
    { 
      timestamp: new Date().toISOString(),
      status: 'healthy',
      uptime: process.uptime()
    },
    'Server is running'
  );
  res.status(200).json(response);
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Todo routes
app.use('/api/todos', todoRoutes);

// ============================================
// Error Handling
// ============================================

// 404 Not Found handler
app.use(notFoundHandler);

// Global error handler (harus di akhir)
app.use(errorHandler);

module.exports = app;