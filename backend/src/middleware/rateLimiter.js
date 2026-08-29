// ============================================
// Fix It — Rate Limiter Middleware
// ============================================
import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests — please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict limiter for auth endpoints (prevent brute force)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 attempts per 15 min
  message: {
    success: false,
    message: 'Too many login attempts — please try again in 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Upload limiter (prevent abuse)
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    message: 'Upload limit reached — please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default { apiLimiter, authLimiter, uploadLimiter };
