// ============================================
// Fix It — Redis Configuration
// ============================================
import Redis from 'ioredis';
import logger from '../utils/logger.js';

let redisClient = null;

/**
 * Create and connect Redis client
 */
export const connectRedis = async () => {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });

    // Add error handler to prevent uncaught exceptions when Redis is down
    redisClient.on('error', (err) => {
      // Errors are caught by the try-catch block below during initial connect,
      // but this prevents uncaught exceptions if the connection drops later.
    });

    await redisClient.connect();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.warn('⚠️  Redis connection failed:', error.message);
    logger.info('💡 App will continue without Redis caching/queues');
    redisClient = null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedis = () => redisClient;

/**
 * Cache helper — get value
 */
export const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

/**
 * Cache helper — set value with TTL
 */
export const cacheSet = async (key, value, ttlSeconds = 300) => {
  if (!redisClient) return;
  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Silently fail cache writes
  }
};

/**
 * Cache helper — delete value
 */
export const cacheDel = async (key) => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch {
    // Silently fail
  }
};

export default { connectRedis, getRedis, cacheGet, cacheSet, cacheDel };
