// ============================================
// Fix It — Role-Based Access Control Middleware
// ============================================
import { forbiddenResponse } from '../utils/response.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Restrict access to specific roles
 * Usage: rbac(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN)
 */
export const rbac = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbiddenResponse(res, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbiddenResponse(res, `Access restricted to: ${allowedRoles.join(', ')}`);
    }

    next();
  };
};

/**
 * Check if user is admin or super_admin
 */
export const isAdmin = rbac(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN);

/**
 * Check if user is official, admin, or super_admin
 */
export const isOfficialOrAdmin = rbac(USER_ROLES.OFFICIAL, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN);

/**
 * Check if user is the resource owner OR an admin
 */
export const isOwnerOrAdmin = (ownerField = 'citizen_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return forbiddenResponse(res, 'Authentication required');
    }

    const isOwner = req.resource && req.resource[ownerField] === req.user.id;
    const isAdminUser = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(req.user.role);

    if (!isOwner && !isAdminUser) {
      return forbiddenResponse(res, 'You can only access your own resources');
    }

    next();
  };
};

/**
 * Super admin only
 */
export const isSuperAdmin = rbac(USER_ROLES.SUPER_ADMIN);

export default { rbac, isAdmin, isOfficialOrAdmin, isOwnerOrAdmin, isSuperAdmin };
