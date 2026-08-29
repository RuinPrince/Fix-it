// ============================================
// Fix It — Utility Helper Functions
// ============================================
import crypto from 'crypto';

/**
 * Generate a unique complaint number like FIX-2024-00001
 */
export const generateComplaintNumber = (id) => {
  const year = new Date().getFullYear();
  const padded = String(id).padStart(5, '0');
  return `FIX-${year}-${padded}`;
};

/**
 * Generate a random token
 */
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => (value * Math.PI) / 180;

/**
 * Sanitize text input — strip HTML tags
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
};

/**
 * Calculate estimated resolution time based on priority
 */
export const calculateResolutionETA = (priority, slaHours) => {
  const hours = slaHours || {
    critical: 4,
    high: 24,
    medium: 48,
    low: 72,
  }[priority] || 48;

  const eta = new Date();
  eta.setHours(eta.getHours() + hours);
  return eta;
};

/**
 * Mask email for anonymous display
 */
export const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const masked = name.charAt(0) + '***' + name.charAt(name.length - 1);
  return `${masked}@${domain}`;
};

/**
 * Mask phone number for anonymous display
 */
export const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.slice(0, 3) + '****' + phone.slice(-3);
};

/**
 * Generate a pagination object for Sequelize queries
 */
export const getPagination = (page = 1, limit = 20) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  return {
    limit: parseInt(limit),
    offset,
  };
};

/**
 * Format Sequelize validation errors into a clean array
 */
export const formatSequelizeErrors = (error) => {
  if (error.errors) {
    return error.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  return [{ message: error.message }];
};

/**
 * Check if a string contains any keywords from an array
 */
export const containsKeywords = (text, keywords) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()));
};

/**
 * Sleep utility for async operations
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
