// ============================================
// Fix It — Express Application Setup
// ============================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';

import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { auditMiddleware } from './middleware/audit.js';
import swaggerSpec from './config/swagger.js';
import logger from './utils/logger.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import {
  departmentRouter, wardRouter, categoryRouter, chatRouter,
  notificationRouter, feedbackRouter, analyticsRouter,
  auditRouter, adminRouter, aiRouter,
} from './routes/other.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ============================================
// Core Middleware
// ============================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request logging
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Rate limiting
app.use('/api/', apiLimiter);

// Audit logging for write operations
app.use('/api/', auditMiddleware);

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

// ============================================
// API Routes
// ============================================
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/complaints`, complaintRoutes);
app.use(`${API_PREFIX}/departments`, departmentRouter);
app.use(`${API_PREFIX}/wards`, wardRouter);
app.use(`${API_PREFIX}/categories`, categoryRouter);
app.use(`${API_PREFIX}/chat`, chatRouter);
app.use(`${API_PREFIX}/notifications`, notificationRouter);
app.use(`${API_PREFIX}/feedback`, feedbackRouter);
app.use(`${API_PREFIX}/analytics`, analyticsRouter);
app.use(`${API_PREFIX}/audit`, auditRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/ai`, aiRouter);

// ============================================
// Swagger API Documentation
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fix It API Documentation',
}));

// JSON spec endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ============================================
// Health Check
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Fix It API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Fix It — Smart Civic Issue Reporting API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
    api: '/api/v1',
  });
});

// ============================================
// Error Handling
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
