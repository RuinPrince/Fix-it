// ============================================
// Fix It — Complaint Controller (Core)
// ============================================
import { Op } from 'sequelize';
import {
  Complaint, ComplaintImage, StatusHistory, Category,
  Department, Ward, User, UserProfile, Notification, Escalation,
} from '../models/index.js';
import { successResponse, createdResponse, errorResponse, notFoundResponse, paginatedResponse } from '../utils/response.js';
import { COMPLAINT_STATUS, VALID_STATUS_TRANSITIONS, REPUTATION_POINTS, SOCKET_EVENTS } from '../utils/constants.js';
import { calculateResolutionETA, getPagination, containsKeywords } from '../utils/helpers.js';
import { emitToUser, emitComplaintUpdate } from '../config/socket.js';
import { createAuditLog } from '../middleware/audit.js';
import logger from '../utils/logger.js';

/**
 * GET /api/v1/complaints
 * List complaints with filtering, sorting, and pagination
 */
export const getComplaints = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20,
      status, priority, category_id, ward_id, department_id,
      search, sort_by = 'created_at', sort_order = 'DESC',
      is_emergency, assigned_to_me,
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category_id) where.category_id = category_id;
    if (ward_id) where.ward_id = ward_id;
    if (department_id) where.assigned_dept_id = department_id;
    if (is_emergency === 'true') where.is_emergency = true;

    // Officials see only their assigned complaints
    if (assigned_to_me === 'true' && req.user) {
      where.assigned_official_id = req.userId;
    }

    // Citizens see only their own complaints
    if (req.userRole === 'citizen') {
      where.citizen_id = req.userId;
    }

    // Search by title, description, or complaint number
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { complaint_number: { [Op.like]: `%${search}%` } },
      ];
    }

    const { offset, limit: lim } = getPagination(page, limit);
    const { count, rows } = await Complaint.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'name_ta', 'icon'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name', 'number'] },
        { model: Department, as: 'assigned_department', attributes: ['id', 'name'] },
        { model: User, as: 'citizen', attributes: ['id', 'email'], include: [
          { model: UserProfile, as: 'profile', attributes: ['full_name'] },
        ]},
        { model: User, as: 'assigned_official', attributes: ['id', 'email'], include: [
          { model: UserProfile, as: 'profile', attributes: ['full_name'] },
        ]},
        { model: ComplaintImage, as: 'images', attributes: ['id', 'image_url', 'thumbnail_url'] },
      ],
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: lim,
      offset,
      distinct: true,
    });

    return paginatedResponse(res, rows, count, page, lim);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/complaints/:id
 * Get single complaint with full details
 */
export const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Ward, as: 'ward' },
        { model: Department, as: 'assigned_department' },
        { model: User, as: 'citizen', attributes: ['id', 'email', 'is_anonymous'], include: [
          { model: UserProfile, as: 'profile', attributes: ['full_name', 'avatar_url'] },
        ]},
        { model: User, as: 'assigned_official', attributes: ['id', 'email'], include: [
          { model: UserProfile, as: 'profile', attributes: ['full_name'] },
        ]},
        { model: ComplaintImage, as: 'images' },
        { model: StatusHistory, as: 'status_history', include: [
          { model: User, as: 'changed_by', attributes: ['id', 'email'], include: [
            { model: UserProfile, as: 'profile', attributes: ['full_name'] },
          ]},
        ], order: [['created_at', 'ASC']] },
        { model: Escalation, as: 'escalations', include: [
          { model: User, as: 'escalated_from', attributes: ['id'], include: [
            { model: UserProfile, as: 'profile', attributes: ['full_name'] },
          ]},
        ]},
      ],
    });

    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    // Hide citizen info if anonymous (unless viewer is admin/official)
    const data = complaint.toJSON();
    if (data.is_anonymous && req.userRole === 'citizen' && data.citizen_id !== req.userId) {
      data.citizen = { id: null, email: 'Anonymous', profile: { full_name: 'Anonymous Citizen' } };
    }

    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/complaints
 * Create a new complaint
 */
export const createComplaint = async (req, res, next) => {
  try {
    const {
      title, description, category_id, latitude, longitude,
      address, ward_id, is_anonymous, is_emergency,
    } = req.body;

    // AI severity prediction (simple rule-based)
    let ai_severity_score = 0.5;
    let priority = 'medium';

    if (is_emergency) {
      ai_severity_score = 1.0;
      priority = 'critical';
    } else {
      const category = await Category.findByPk(category_id);
      if (category) {
        ai_severity_score = Math.min(category.priority_weight / 5, 1.0);
        if (containsKeywords(description, ['urgent', 'emergency', 'danger', 'flood', 'collapse'])) {
          ai_severity_score = Math.min(ai_severity_score + 0.3, 1.0);
        }
      }
      if (ai_severity_score >= 0.8) priority = 'critical';
      else if (ai_severity_score >= 0.6) priority = 'high';
      else if (ai_severity_score >= 0.3) priority = 'medium';
      else priority = 'low';
    }

    // Auto-assign department based on category
    const category = await Category.findByPk(category_id);
    const assigned_dept_id = category?.department_id || null;

    // Calculate resolution ETA
    const resolution_eta = calculateResolutionETA(priority, category?.sla_hours);

    const complaint = await Complaint.create({
      citizen_id: req.userId,
      category_id,
      title,
      description,
      latitude,
      longitude,
      address,
      ward_id,
      is_anonymous,
      is_emergency,
      priority,
      ai_severity_score,
      ai_category_prediction: category?.name || null,
      assigned_dept_id,
      resolution_eta,
    });

    // Create initial status history
    await StatusHistory.create({
      complaint_id: complaint.id,
      old_status: null,
      new_status: 'submitted',
      changed_by_id: req.userId,
      notes: 'Complaint submitted by citizen',
    });

    // Award reputation points
    await User.increment('reputation_points', {
      by: REPUTATION_POINTS.COMPLAINT_FILED,
      where: { id: req.userId },
    });

    // Create notification for department
    if (assigned_dept_id) {
      const deptHead = await Department.findByPk(assigned_dept_id);
      if (deptHead?.head_user_id) {
        await Notification.create({
          user_id: deptHead.head_user_id,
          complaint_id: complaint.id,
          title: 'New Complaint Received',
          message: `New ${priority} priority complaint: ${title}`,
          type: 'assignment',
        });
        emitToUser(deptHead.head_user_id, SOCKET_EVENTS.NOTIFICATION, {
          title: 'New Complaint',
          message: title,
          complaintId: complaint.id,
        });
      }
    }

    // Fetch the created complaint with associations
    const fullComplaint = await Complaint.findByPk(complaint.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Ward, as: 'ward' },
        { model: ComplaintImage, as: 'images' },
      ],
    });

    return createdResponse(res, fullComplaint, 'Complaint submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/complaints/:id
 * Update a complaint
 */
export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    // Citizens can only update their own complaints that aren't resolved
    if (req.userRole === 'citizen') {
      if (complaint.citizen_id !== req.userId) {
        return errorResponse(res, 'You can only update your own complaints', 403);
      }
      if (['resolved', 'closed'].includes(complaint.status)) {
        return errorResponse(res, 'Cannot update a resolved/closed complaint', 400);
      }
    }

    const allowedFields = ['title', 'description', 'latitude', 'longitude', 'address', 'ward_id'];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    // Admins/officials can update additional fields
    if (['official', 'admin', 'super_admin'].includes(req.userRole)) {
      if (req.body.priority) updateData.priority = req.body.priority;
      if (req.body.internal_notes !== undefined) updateData.internal_notes = req.body.internal_notes;
    }

    await complaint.update(updateData);

    return successResponse(res, complaint, 'Complaint updated');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/complaints/:id
 * Delete a complaint (admin only)
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    await complaint.destroy();
    await createAuditLog(req.userId, 'DELETE', 'complaints', req.params.id);

    return successResponse(res, null, 'Complaint deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/complaints/:id/images
 * Upload images for a complaint
 */
export const uploadImages = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No images uploaded', 400);
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        // In production, upload to Firebase Storage. For now, use local path.
        const image_url = `/uploads/${file.filename}`;
        return ComplaintImage.create({
          complaint_id: complaint.id,
          image_url,
          thumbnail_url: image_url, // In production, generate thumbnail
          original_filename: file.originalname,
          file_size: file.size,
          ai_validated: true, // Placeholder — AI validation would run here
          ai_labels: [],
        });
      })
    );

    return createdResponse(res, images, `${images.length} image(s) uploaded`);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/complaints/:id/status
 * Update complaint status
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    // Validate status transition
    const validTransitions = VALID_STATUS_TRANSITIONS[complaint.status] || [];
    if (!validTransitions.includes(status)) {
      return errorResponse(res, `Cannot transition from "${complaint.status}" to "${status}". Valid: ${validTransitions.join(', ')}`, 400);
    }

    const oldStatus = complaint.status;
    const updateData = { status };
    if (status === 'resolved') updateData.resolved_at = new Date();

    await complaint.update(updateData);

    // Create status history entry
    await StatusHistory.create({
      complaint_id: complaint.id,
      old_status: oldStatus,
      new_status: status,
      changed_by_id: req.userId,
      notes,
    });

    // Notify the citizen
    await Notification.create({
      user_id: complaint.citizen_id,
      complaint_id: complaint.id,
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" status changed to: ${status.replace('_', ' ').toUpperCase()}`,
      type: 'status_update',
      data: { old_status: oldStatus, new_status: status },
    });

    // Real-time notification
    emitToUser(complaint.citizen_id, SOCKET_EVENTS.STATUS_CHANGE, {
      complaintId: complaint.id,
      oldStatus,
      newStatus: status,
    });

    // Award points on resolution
    if (status === 'resolved') {
      await User.increment('reputation_points', {
        by: REPUTATION_POINTS.COMPLAINT_RESOLVED,
        where: { id: complaint.citizen_id },
      });
    }

    return successResponse(res, { complaint, status_history: { oldStatus, newStatus: status, notes } }, 'Status updated');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/complaints/:id/assign
 * Assign complaint to department/official
 */
export const assignComplaint = async (req, res, next) => {
  try {
    const { department_id, official_id, notes } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    const updateData = {};
    if (department_id) updateData.assigned_dept_id = department_id;
    if (official_id) updateData.assigned_official_id = official_id;
    if (complaint.status === 'submitted' || complaint.status === 'acknowledged') {
      updateData.status = 'assigned';
    }

    const oldStatus = complaint.status;

    await complaint.update(updateData);

    // Status history
    if (updateData.status) {
      await StatusHistory.create({
        complaint_id: complaint.id,
        old_status: oldStatus,
        new_status: 'assigned',
        changed_by_id: req.userId,
        notes: notes || 'Complaint assigned',
      });
    }

    // Notify assigned official
    if (official_id) {
      await Notification.create({
        user_id: official_id,
        complaint_id: complaint.id,
        title: 'Complaint Assigned to You',
        message: `Complaint "${complaint.title}" has been assigned to you`,
        type: 'assignment',
      });
      emitToUser(official_id, SOCKET_EVENTS.NOTIFICATION, {
        title: 'New Assignment',
        message: complaint.title,
        complaintId: complaint.id,
      });
    }

    return successResponse(res, complaint, 'Complaint assigned');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/complaints/bulk-assign
 * Bulk assign multiple complaints
 */
export const bulkAssign = async (req, res, next) => {
  try {
    const { complaint_ids, department_id, official_id } = req.body;

    const updateData = {};
    if (department_id) updateData.assigned_dept_id = department_id;
    if (official_id) updateData.assigned_official_id = official_id;
    updateData.status = 'assigned';

    const [updatedCount] = await Complaint.update(updateData, {
      where: { id: { [Op.in]: complaint_ids } },
    });

    // Create status history for each
    await Promise.all(
      complaint_ids.map((id) =>
        StatusHistory.create({
          complaint_id: id,
          old_status: null,
          new_status: 'assigned',
          changed_by_id: req.userId,
          notes: 'Bulk assignment',
        })
      )
    );

    return successResponse(res, { updated: updatedCount }, `${updatedCount} complaints assigned`);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/complaints/:id/escalate
 * Escalate a complaint
 */
export const escalateComplaint = async (req, res, next) => {
  try {
    const { reason, escalated_to_id } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return notFoundResponse(res, 'Complaint');
    }

    // Get current escalation level
    const lastEscalation = await Escalation.findOne({
      where: { complaint_id: complaint.id },
      order: [['level', 'DESC']],
    });

    const escalation = await Escalation.create({
      complaint_id: complaint.id,
      escalated_from_id: req.userId,
      escalated_to_id: escalated_to_id || null,
      reason,
      level: (lastEscalation?.level || 0) + 1,
    });

    // Update priority if not already critical
    if (complaint.priority !== 'critical') {
      const priorities = ['low', 'medium', 'high', 'critical'];
      const currentIdx = priorities.indexOf(complaint.priority);
      if (currentIdx < priorities.length - 1) {
        await complaint.update({ priority: priorities[currentIdx + 1] });
      }
    }

    // Notify escalated_to user
    if (escalated_to_id) {
      await Notification.create({
        user_id: escalated_to_id,
        complaint_id: complaint.id,
        title: 'Complaint Escalated to You',
        message: `Complaint "${complaint.title}" escalated: ${reason}`,
        type: 'escalation',
      });
      emitToUser(escalated_to_id, SOCKET_EVENTS.NOTIFICATION, {
        title: 'Escalation',
        message: reason,
        complaintId: complaint.id,
      });
    }

    return createdResponse(res, escalation, 'Complaint escalated');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/complaints/:id/timeline
 * Get complaint status timeline
 */
export const getTimeline = async (req, res, next) => {
  try {
    const history = await StatusHistory.findAll({
      where: { complaint_id: req.params.id },
      include: [{
        model: User, as: 'changed_by', attributes: ['id', 'email'],
        include: [{ model: UserProfile, as: 'profile', attributes: ['full_name'] }],
      }],
      order: [['created_at', 'ASC']],
    });

    return successResponse(res, history);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/complaints/nearby
 * Get complaints near a GPS location
 */
export const getNearby = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 2 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return errorResponse(res, 'Latitude and longitude are required', 400);
    }

    // Haversine formula in SQL for MySQL
    const complaints = await Complaint.findAll({
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
      },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon'] },
        { model: ComplaintImage, as: 'images', attributes: ['image_url'], limit: 1 },
      ],
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    // Filter by distance in JS (simpler than raw SQL for demo)
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    const nearby = complaints.filter((c) => {
      const dLat = (parseFloat(c.latitude) - lat) * Math.PI / 180;
      const dLon = (parseFloat(c.longitude) - lon) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * Math.PI / 180) * Math.cos(parseFloat(c.latitude) * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const d = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return d <= rad;
    });

    return successResponse(res, nearby, `${nearby.length} complaints within ${rad}km`);
  } catch (error) {
    next(error);
  }
};

export default {
  getComplaints, getComplaint, createComplaint, updateComplaint, deleteComplaint,
  uploadImages, updateStatus, assignComplaint, bulkAssign, escalateComplaint,
  getTimeline, getNearby,
};
