// ============================================
// Fix It — Socket.IO Configuration
// ============================================
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { SOCKET_EVENTS } from '../utils/constants.js';

let io = null;

/**
 * Initialize Socket.IO server
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      // Allow anonymous connections for public complaint tracking
      socket.userId = null;
      socket.userRole = 'guest';
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id} (user: ${socket.userId || 'anonymous'})`);

    // Join user's personal notification room
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
    }

    // Join complaint room for real-time updates
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      logger.debug(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Leave complaint room
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      logger.debug(`Socket ${socket.id} left room: ${roomId}`);
    });

    // Chat message
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data) => {
      const { roomId, message, messageType } = data;
      io.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, {
        senderId: socket.userId,
        message,
        messageType: messageType || 'text',
        timestamp: new Date().toISOString(),
      });
    });

    // Typing indicators
    socket.on(SOCKET_EVENTS.TYPING, (roomId) => {
      socket.to(roomId).emit(SOCKET_EVENTS.USER_TYPING, { userId: socket.userId });
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, (roomId) => {
      socket.to(roomId).emit(SOCKET_EVENTS.USER_STOP_TYPING, { userId: socket.userId });
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      logger.debug(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    logger.warn('Socket.IO not initialized');
  }
  return io;
};

/**
 * Send notification to a specific user
 */
export const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(`user_${userId}`).emit(event, data);
};

/**
 * Send complaint update to all subscribers
 */
export const emitComplaintUpdate = (complaintId, data) => {
  if (!io) return;
  io.to(`complaint_${complaintId}`).emit(SOCKET_EVENTS.COMPLAINT_UPDATE, data);
};

/**
 * Broadcast to all connected clients
 */
export const broadcast = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

export default { initSocket, getIO, emitToUser, emitComplaintUpdate, broadcast };
