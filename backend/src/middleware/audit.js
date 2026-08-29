// ============================================
// Fix It — Audit Logging Middleware
// ============================================
import { AuditLog } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Auto-log write operations (POST/PUT/PATCH/DELETE) to audit_logs
 */
export const auditMiddleware = (req, res, next) => {
  // Only log write operations
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Log after response is sent
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        logAudit(req, body).catch((err) => logger.error('Audit log failed:', err));
      }
      return originalJson(body);
    };
  }
  next();
};

/**
 * Write audit log entry
 */
async function logAudit(req, responseBody) {
  try {
    const action = getAction(req.method);
    const [modelName, objectId] = parseRoute(req.originalUrl);

    await AuditLog.create({
      user_id: req.user?.id,
      action,
      model_name: modelName,
      object_id: objectId,
      new_values: req.method !== 'DELETE' ? sanitizeBody(req.body) : null,
      ip_address: req.ip || req.connection?.remoteAddress,
      user_agent: req.get('User-Agent'),
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error.message);
  }
}

function getAction(method) {
  const map = { POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };
  return map[method] || method;
}

function parseRoute(url) {
  // Extract model name and ID from URL like /api/v1/complaints/5
  const parts = url.replace(/^\/api\/v1\//, '').split('/').filter(Boolean);
  const modelName = parts[0] || null;
  const objectId = parseInt(parts[1]) || null;
  return [modelName, objectId];
}

function sanitizeBody(body) {
  if (!body) return null;
  const sanitized = { ...body };
  delete sanitized.password;
  delete sanitized.password_hash;
  delete sanitized.token;
  delete sanitized.refreshToken;
  return sanitized;
}

/**
 * Manual audit log helper for custom events
 */
export const createAuditLog = async (userId, action, modelName, objectId, details = {}) => {
  try {
    await AuditLog.create({
      user_id: userId,
      action,
      model_name: modelName,
      object_id: objectId,
      new_values: details,
    });
  } catch (error) {
    logger.error('Manual audit log failed:', error.message);
  }
};

export default { auditMiddleware, createAuditLog };
