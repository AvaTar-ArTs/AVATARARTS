const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const { Server } = require('socket.io');
const http = require('http');
require('express-async-errors');
require('dotenv').config();

// Initialize services
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});
const prisma = new PrismaClient();

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true
}));

// Rate limiting with different tiers
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Stricter limit for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

app.use('/api/auth', authLimiter);
app.use(generalLimiter);

// Logging and compression
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// AI Service Integration (Mock implementation - replace with actual AI service)
const aiService = {
  async matchCleanerToProperty(propertyData, cleanerPreferences) {
    // Mock AI matching algorithm
    const score = Math.random() * 100;
    return {
      matchScore: score,
      recommendedCleaners: [],
      reasoning: 'AI analysis based on property characteristics and cleaner expertise'
    };
  },

  async analyzePropertyDamage(images) {
    // Mock computer vision analysis
    return {
      damageDetected: false,
      severity: 'none',
      recommendations: ['Property appears to be in good condition']
    };
  },

  async generateCleaningPlan(propertyType, size, requirements) {
    // Mock cleaning plan generation
    return {
      estimatedTime: '2-3 hours',
      requiredSupplies: ['All-purpose cleaner', 'Microfiber cloths', 'Vacuum'],
      steps: [
        'Dust all surfaces',
        'Clean bathrooms thoroughly',
        'Vacuum all floors',
        'Kitchen deep clean'
      ]
    };
  }
};

// Health check endpoint with detailed system info
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'Connected',
      memory: process.memoryUsage(),
      version: '2.0.0'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'CleanConnect Pro API v2.0',
    version: '2.0.0',
    status: 'running',
    features: [
      'AI-Powered Matching',
      'Real-time Tracking',
      'Secure Payments',
      'Property Management',
      'Analytics Dashboard'
    ],
    documentation: '/api/docs'
  });
});

// Authentication routes
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('userType').isIn(['host', 'cleaner', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, userType } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        userType,
        isVerified: false
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${user.email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      },
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI-powered matching endpoint
app.post('/api/ai/match', authenticateToken, [
  body('propertyType').isIn(['apartment', 'house', 'condo', 'townhouse']),
  body('size').isInt({ min: 1 }),
  body('location').notEmpty(),
  body('specialRequirements').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { propertyType, size, location, specialRequirements } = req.body;

    // Get available cleaners
    const cleaners = await prisma.user.findMany({
      where: {
        userType: 'cleaner',
        isVerified: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        rating: true,
        hourlyRate: true,
        specialties: true
      }
    });

    // Use AI service for matching
    const aiMatch = await aiService.matchCleanerToProperty(
      { propertyType, size, location, specialRequirements },
      cleaners
    );

    res.json({
      message: 'AI matching completed',
      matches: aiMatch,
      availableCleaners: cleaners.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI matching error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Real-time booking updates via Socket.io
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-booking', (bookingId) => {
    socket.join(`booking-${bookingId}`);
    logger.info(`Client ${socket.id} joined booking ${bookingId}`);
  });

  socket.on('booking-update', (data) => {
    socket.to(`booking-${data.bookingId}`).emit('booking-status-changed', data);
    logger.info(`Booking update broadcasted: ${data.bookingId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 CleanConnect Pro API v2.0 server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔗 API endpoint: http://localhost:${PORT}/api`);
  logger.info(`🔌 Socket.io enabled for real-time features`);
});

module.exports = { app, server, io };
