require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Stripe webhook route - MUST be before express.json() to preserve raw body
app.use('/api/v1/payments/webhook', require('./payments/paymentRoutes'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes (to be implemented)
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Hookmark Pro API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      bookmarks: '/api/v1/bookmarks',
      analytics: '/api/v1/analytics',
      payments: '/api/v1/payments',
      teams: '/api/v1/teams'
    }
  });
});

// API Routes
app.use('/api/v1/auth', require('./auth/authRoutes'));
app.use('/api/v1/payments', require('./payments/paymentRoutes'));
app.use('/api/v1/bookmarks', require('./bookmarks/bookmarkRoutes'));
// TODO: Implement remaining routes
// app.use('/api/v1/analytics', require('./analytics/analyticsRoutes'));
// app.use('/api/v1/teams', require('./teams/teamRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║      🪝 Hookmark Pro Backend API                   ║
║                                                    ║
║      Status: Running                               ║
║      Port: ${PORT}                                       ║
║      Environment: ${process.env.NODE_ENV || 'development'}                       ║
║      Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}      ║
║                                                    ║
║      API Docs: http://localhost:${PORT}/api/v1         ║
║      Health: http://localhost:${PORT}/health           ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
