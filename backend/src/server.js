// ============================================
// Fix It — Server Entry Point
// ============================================
import { createServer } from 'http';
import dotenv from 'dotenv';
import { mkdirSync } from 'fs';

// Load environment variables
dotenv.config();

import app from './app.js';
import { connectDB, syncDB } from './config/database.js';
import { initFirebase } from './config/firebase.js';
import { connectRedis } from './config/redis.js';
import { initSocket } from './config/socket.js';
import logger from './utils/logger.js';

// Ensure uploads and logs directories exist
try { mkdirSync('uploads', { recursive: true }); } catch {}
try { mkdirSync('logs', { recursive: true }); } catch {}

const PORT = process.env.PORT || 5000;

async function startServer() {
  logger.info('🚀 Starting Fix It API Server...');

  // Initialize services (graceful — continues even if some fail)
  await connectDB();
  await initFirebase();
  await connectRedis();

  // Sync database (creates tables if they don't exist)
  await syncDB(false);

  // Create HTTP server
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initSocket(httpServer);

  // Start listening
  httpServer.listen(PORT, () => {
    logger.info(`✅ Fix It API running on http://localhost:${PORT}`);
    logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    logger.info(`❤️  Health: http://localhost:${PORT}/health`);
    logger.info(`🔌 Socket.IO ready for connections`);
    logger.info(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`\n${signal} received — shutting down gracefully...`);
    httpServer.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('❌ Forced shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err);
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
  });
}

startServer().catch((err) => {
  logger.error('❌ Failed to start server:', err);
  process.exit(1);
});
