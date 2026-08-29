// ============================================
// Fix It — Complaint Routes
// ============================================
import { Router } from 'express';
import {
  getComplaints, getComplaint, createComplaint, updateComplaint,
  deleteComplaint, uploadImages as uploadComplaintImages, updateStatus,
  assignComplaint, bulkAssign, escalateComplaint, getTimeline, getNearby,
} from '../controllers/complaintController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { isOfficialOrAdmin, isAdmin } from '../middleware/rbac.js';
import { validate, complaintSchema, statusUpdateSchema, assignSchema, bulkAssignSchema, escalateSchema } from '../middleware/validator.js';
import { uploadImages } from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * @swagger
 * /api/v1/complaints:
 *   get:
 *     tags: [Complaints]
 *     summary: List complaints with filters
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: priority
 *         schema: { type: string }
 *       - in: query
 *         name: category_id
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated complaint list }
 */
router.get('/', authenticate, getComplaints);

/**
 * @swagger
 * /api/v1/complaints/nearby:
 *   get:
 *     tags: [Complaints]
 *     summary: Get nearby complaints by GPS
 */
router.get('/nearby', optionalAuth, getNearby);

/**
 * @swagger
 * /api/v1/complaints:
 *   post:
 *     tags: [Complaints]
 *     summary: Create a new complaint
 */
router.post('/', authenticate, validate(complaintSchema), createComplaint);

/**
 * @swagger
 * /api/v1/complaints/bulk-assign:
 *   post:
 *     tags: [Complaints]
 *     summary: Bulk assign complaints
 */
router.post('/bulk-assign', authenticate, isOfficialOrAdmin, validate(bulkAssignSchema), bulkAssign);

/**
 * @swagger
 * /api/v1/complaints/{id}:
 *   get:
 *     tags: [Complaints]
 *     summary: Get complaint details
 */
router.get('/:id', authenticate, getComplaint);

/**
 * @swagger
 * /api/v1/complaints/{id}:
 *   put:
 *     tags: [Complaints]
 *     summary: Update a complaint
 */
router.put('/:id', authenticate, updateComplaint);

/**
 * @swagger
 * /api/v1/complaints/{id}:
 *   delete:
 *     tags: [Complaints]
 *     summary: Delete a complaint (admin only)
 */
router.delete('/:id', authenticate, isAdmin, deleteComplaint);

/**
 * @swagger
 * /api/v1/complaints/{id}/images:
 *   post:
 *     tags: [Complaints]
 *     summary: Upload images for a complaint
 */
router.post('/:id/images', authenticate, uploadLimiter, uploadImages, uploadComplaintImages);

/**
 * @swagger
 * /api/v1/complaints/{id}/status:
 *   put:
 *     tags: [Complaints]
 *     summary: Update complaint status
 */
router.put('/:id/status', authenticate, isOfficialOrAdmin, validate(statusUpdateSchema), updateStatus);

/**
 * @swagger
 * /api/v1/complaints/{id}/assign:
 *   post:
 *     tags: [Complaints]
 *     summary: Assign complaint to department/official
 */
router.post('/:id/assign', authenticate, isOfficialOrAdmin, validate(assignSchema), assignComplaint);

/**
 * @swagger
 * /api/v1/complaints/{id}/escalate:
 *   post:
 *     tags: [Complaints]
 *     summary: Escalate a complaint
 */
router.post('/:id/escalate', authenticate, isOfficialOrAdmin, validate(escalateSchema), escalateComplaint);

/**
 * @swagger
 * /api/v1/complaints/{id}/timeline:
 *   get:
 *     tags: [Complaints]
 *     summary: Get complaint status timeline
 */
router.get('/:id/timeline', authenticate, getTimeline);

export default router;
