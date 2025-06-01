const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path'); // ADD: Import path module
require('dotenv').config();

const app = express();

// 📦 Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const challengeRoutes = require('./routes/challenges');
const forestRoutes = require('./routes/forest');
const communityRoutes = require('./routes/community');
const leaderboardRoutes = require('./routes/Leaderboard');
const ecoEduRoutes = require('./routes/ecoedu');
const adminRoutes = require('./routes/admin');
const submissionRoutes = require('./routes/submissions');

// 🛡️ Middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// 🔐 Security - MODIFIED: Configure helmet to allow images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
}));
app.use(compression());

// 🌐 CORS - ENHANCED: Better CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL]
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 🚧 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    error: 'Terlalu banyak permintaan dari IP ini. Coba lagi nanti.',
    retryAfter: '15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1'
});
app.use(limiter);

// 🧠 Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 📜 Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// 📁 STATIC FILE SERVING - ADD: Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set CORS headers for static files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Set appropriate content type for images
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      res.setHeader('Content-Type', 'image/' + path.extname(filePath).slice(1));
    }
  }
}));

// 📁 CREATE UPLOADS DIR IF NOT EXISTS - ADD: Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
const submissionsDir = path.join(uploadsDir, 'submissions');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
  console.log('📁 Created submissions directory');
}

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ Request Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });
}

// 🩺 Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EcoQuest API is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 📚 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/forest', forestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ecoedu', ecoEduRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/submissions', submissionRoutes);

// 🔍 API Documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'EcoQuest API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      challenges: '/api/challenges',
      forest: '/api/forest',
      community: '/api/community',
      leaderboard: '/api/leaderboard',
      ecoedu: '/api/ecoedu',
      admin: '/api/admin',
      submissions: '/api/submissions',
      uploads: '/uploads' // ADD: Document uploads endpoint
    }
  });
});

// ❌ Not Found & Error Handler (must be last)
app.use(notFound);
app.use(errorHandler);

// 🚀 Server Start
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`
🌱 EcoQuest Backend Server is running!
🌍 Port: ${PORT}
🔗 Environment: ${process.env.NODE_ENV || 'development'}
📊 MongoDB: Connected
🚀 API Health Check: http://localhost:${PORT}/api/health
📋 API Documentation: http://localhost:${PORT}/api
📁 Static Files: http://localhost:${PORT}/uploads
    `);
  });
}

module.exports = app;