// ============================================
// Fix It — All Other Routes
// (Department, Ward, Category, Chat, Notification,
//  Feedback, Analytics, Audit, Admin, AI)
// ============================================
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { isAdmin, isOfficialOrAdmin } from '../middleware/rbac.js';
import { validate, departmentSchema, wardSchema, feedbackSchema, chatMessageSchema } from '../middleware/validator.js';
import { uploadChatImage } from '../middleware/upload.js';
import {
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getWards, createWard, updateWard, deleteWard,
  getCategories, createCategory,
  getChatMessages, sendChatMessage,
  getNotifications, markNotificationsRead,
  submitFeedback, getFeedback,
  getDashboardStats, getHeatmapData, getSLAData, getMonthlyTrends,
  getAuditLogs,
  getUsers, updateUser, deleteUser,
  validateImage, predictCategory, predictSeverity,
} from '../controllers/otherControllers.js';

// ============================================
// Department Routes
// ============================================
export const departmentRouter = Router();

/** @swagger
 * /api/v1/departments:
 *   get: { tags: [Departments], summary: List all departments }
 */
departmentRouter.get('/', authenticate, getDepartments);
departmentRouter.post('/', authenticate, isAdmin, validate(departmentSchema), createDepartment);
departmentRouter.put('/:id', authenticate, isAdmin, validate(departmentSchema), updateDepartment);
departmentRouter.delete('/:id', authenticate, isAdmin, deleteDepartment);

// ============================================
// Ward Routes
// ============================================
export const wardRouter = Router();

wardRouter.get('/', authenticate, getWards);
wardRouter.post('/', authenticate, isAdmin, validate(wardSchema), createWard);
wardRouter.put('/:id', authenticate, isAdmin, validate(wardSchema), updateWard);
wardRouter.delete('/:id', authenticate, isAdmin, deleteWard);

// ============================================
// Category Routes
// ============================================
export const categoryRouter = Router();

categoryRouter.get('/', getCategories); // Public endpoint
categoryRouter.post('/', authenticate, isAdmin, createCategory);

// ============================================
// Chat Routes
// ============================================
export const chatRouter = Router();

chatRouter.get('/:complaintId', authenticate, getChatMessages);
chatRouter.post('/:complaintId', authenticate, validate(chatMessageSchema), sendChatMessage);

// ============================================
// Notification Routes
// ============================================
export const notificationRouter = Router();

notificationRouter.get('/', authenticate, getNotifications);
notificationRouter.put('/read', authenticate, markNotificationsRead);

// ============================================
// Feedback Routes
// ============================================
export const feedbackRouter = Router();

feedbackRouter.post('/', authenticate, validate(feedbackSchema), submitFeedback);
feedbackRouter.get('/:complaintId', authenticate, getFeedback);

// ============================================
// Analytics Routes
// ============================================
export const analyticsRouter = Router();

analyticsRouter.get('/dashboard', authenticate, isOfficialOrAdmin, getDashboardStats);
analyticsRouter.get('/heatmap', authenticate, getHeatmapData);
analyticsRouter.get('/sla', authenticate, isOfficialOrAdmin, getSLAData);
analyticsRouter.get('/trends', authenticate, isOfficialOrAdmin, getMonthlyTrends);

// ============================================
// Audit Routes
// ============================================
export const auditRouter = Router();

auditRouter.get('/logs', authenticate, isAdmin, getAuditLogs);

// ============================================
// Admin Routes
// ============================================
export const adminRouter = Router();

adminRouter.get('/users', authenticate, isAdmin, getUsers);
adminRouter.put('/users/:id', authenticate, isAdmin, updateUser);
adminRouter.delete('/users/:id', authenticate, isAdmin, deleteUser);

// ============================================
// AI Routes
// ============================================
export const aiRouter = Router();

aiRouter.post('/validate-image', authenticate, uploadChatImage, validateImage);
aiRouter.post('/predict-category', authenticate, predictCategory);
aiRouter.post('/predict-severity', authenticate, predictSeverity);
