'use strict';
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ── CORS
app.use(cors({
  origin     : [
    process.env.FRONTEND_URL || 'http://localhost:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
  ],
  credentials: true,
  methods    : ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}));

// ── Rate limiting
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 20,
  message : { success: false, message: 'Too many requests. Please try again after 15 minutes.' },
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 200,
  message : { success: false, message: 'Too many requests.' },
}));

// ── Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Logger
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ── Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Manara-Nexus API Docs',
  customCss      : '.swagger-ui .topbar { background-color: #0F172A; }',
}));

// ── API Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/admin',         require('./routes/adminRoutes'));
app.use('/api/profile',       require('./routes/profileRoutes'));
app.use('/api/campaigns',     require('./routes/campaignRoutes'));
app.use('/api/donations',     require('./routes/donationRoutes'));
app.use('/api/items',         require('./routes/itemRoutes'));
app.use('/api/tasks',         require('./routes/taskRoutes'));
app.use('/api/reports',       require('./routes/reportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/contact',       require('./routes/contactRoutes'));

// ── Health check
app.get('/api/health', (_req, res) =>
  res.json({ success: true, status: 'Manara-Nexus API is running', timestamp: new Date() })
);

// ── 404
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'API endpoint not found.' })
);

// ── Error handler
app.use(errorHandler);

module.exports = app;
