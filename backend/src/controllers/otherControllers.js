// ============================================
// Fix It — Analytics, Department, Ward, Category,
//           Chat, Notification, Feedback, Audit,
//           Admin, AI Controllers
// ============================================
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';
import {
  Complaint, Category, Department, Ward, User, UserProfile,
  Notification, ChatRoom, ChatMessage, Feedback, AuditLog,
  StatusHistory, ComplaintImage,
} from '../models/index.js';
import { successResponse, createdResponse, errorResponse, notFoundResponse, paginatedResponse } from '../utils/response.js';
import { getPagination } from '../utils/helpers.js';
import { emitToUser } from '../config/socket.js';
import { SOCKET_EVENTS } from '../utils/constants.js';
import logger from '../utils/logger.js';

// ============================================
// Department Controller
// ============================================
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll({
      include: [
        { model: User, as: 'head', attributes: ['id', 'email'], include: [
          { model: UserProfile, as: 'profile', attributes: ['full_name'] },
        ]},
        { model: Category, as: 'categories', attributes: ['id', 'name', 'name_ta'] },
      ],
      order: [['name', 'ASC']],
    });
    return successResponse(res, departments);
  } catch (error) { next(error); }
};

export const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    return createdResponse(res, department, 'Department created');
  } catch (error) { next(error); }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return notFoundResponse(res, 'Department');
    await dept.update(req.body);
    return successResponse(res, dept, 'Department updated');
  } catch (error) { next(error); }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return notFoundResponse(res, 'Department');
    await dept.update({ is_active: false });
    return successResponse(res, null, 'Department deactivated');
  } catch (error) { next(error); }
};

// ============================================
// Ward Controller
// ============================================
export const getWards = async (req, res, next) => {
  try {
    const wards = await Ward.findAll({
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
      order: [['number', 'ASC']],
    });
    return successResponse(res, wards);
  } catch (error) { next(error); }
};

export const createWard = async (req, res, next) => {
  try {
    const ward = await Ward.create(req.body);
    return createdResponse(res, ward, 'Ward created');
  } catch (error) { next(error); }
};

export const updateWard = async (req, res, next) => {
  try {
    const ward = await Ward.findByPk(req.params.id);
    if (!ward) return notFoundResponse(res, 'Ward');
    await ward.update(req.body);
    return successResponse(res, ward, 'Ward updated');
  } catch (error) { next(error); }
};

export const deleteWard = async (req, res, next) => {
  try {
    const ward = await Ward.findByPk(req.params.id);
    if (!ward) return notFoundResponse(res, 'Ward');
    await ward.destroy();
    return successResponse(res, null, 'Ward deleted');
  } catch (error) { next(error); }
};

// ============================================
// Category Controller
// ============================================
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
    });
    return successResponse(res, categories);
  } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return createdResponse(res, category, 'Category created');
  } catch (error) { next(error); }
};

// ============================================
// Chat Controller
// ============================================
export const getChatMessages = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    let room = await ChatRoom.findOne({ where: { complaint_id: complaintId } });

    if (!room) {
      // Create room if it doesn't exist
      const complaint = await Complaint.findByPk(complaintId);
      if (!complaint) return notFoundResponse(res, 'Complaint');

      room = await ChatRoom.create({
        complaint_id: complaintId,
        citizen_id: complaint.citizen_id,
        official_id: complaint.assigned_official_id,
      });
    }

    const messages = await ChatMessage.findAll({
      where: { room_id: room.id },
      include: [{
        model: User, as: 'sender', attributes: ['id', 'email', 'role'],
        include: [{ model: UserProfile, as: 'profile', attributes: ['full_name', 'avatar_url'] }],
      }],
      order: [['created_at', 'ASC']],
    });

    return successResponse(res, { room, messages });
  } catch (error) { next(error); }
};

export const sendChatMessage = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { message, message_type } = req.body;

    let room = await ChatRoom.findOne({ where: { complaint_id: complaintId } });
    if (!room) {
      const complaint = await Complaint.findByPk(complaintId);
      if (!complaint) return notFoundResponse(res, 'Complaint');
      room = await ChatRoom.create({
        complaint_id: complaintId,
        citizen_id: complaint.citizen_id,
        official_id: req.userId,
      });
    }

    const chatMsg = await ChatMessage.create({
      room_id: room.id,
      sender_id: req.userId,
      message,
      message_type: message_type || 'text',
    });

    // Determine recipient and notify
    const recipientId = req.userId === room.citizen_id ? room.official_id : room.citizen_id;
    if (recipientId) {
      await Notification.create({
        user_id: recipientId,
        complaint_id: parseInt(complaintId),
        title: 'New Chat Message',
        message: message.substring(0, 100),
        type: 'chat',
      });
      emitToUser(recipientId, SOCKET_EVENTS.NEW_MESSAGE, {
        roomId: room.id,
        complaintId,
        message: chatMsg,
      });
    }

    return createdResponse(res, chatMsg, 'Message sent');
  } catch (error) { next(error); }
};

// ============================================
// Notification Controller
// ============================================
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unread_only } = req.query;
    const where = { user_id: req.userId };
    if (unread_only === 'true') where.is_read = false;

    const { offset, limit: lim } = getPagination(page, limit);
    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: lim,
      offset,
    });

    const unreadCount = await Notification.count({
      where: { user_id: req.userId, is_read: false },
    });

    // Pass the unreadCount in the message, or frontend can calculate it itself. 
    // Data must be the array of notifications to match frontend expectations.
    return paginatedResponse(res, rows, count, page, lim);
  } catch (error) { next(error); }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const where = { user_id: req.userId };
    if (ids && ids.length > 0) where.id = { [Op.in]: ids };

    await Notification.update({ is_read: true }, { where });
    return successResponse(res, null, 'Notifications marked as read');
  } catch (error) { next(error); }
};

// ============================================
// Feedback Controller
// ============================================
export const submitFeedback = async (req, res, next) => {
  try {
    const { complaint_id, rating, comment } = req.body;
    const complaint = await Complaint.findByPk(complaint_id);
    if (!complaint) return notFoundResponse(res, 'Complaint');

    // Check if feedback already exists
    const existing = await Feedback.findOne({
      where: { complaint_id, citizen_id: req.userId },
    });
    if (existing) {
      return errorResponse(res, 'Feedback already submitted for this complaint', 409);
    }

    const feedback = await Feedback.create({
      complaint_id,
      citizen_id: req.userId,
      rating,
      comment,
    });

    // Award points
    await User.increment('reputation_points', {
      by: 3,
      where: { id: req.userId },
    });

    return createdResponse(res, feedback, 'Feedback submitted — thank you!');
  } catch (error) { next(error); }
};

export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findAll({
      where: { complaint_id: req.params.complaintId },
      include: [{
        model: User, as: 'citizen', attributes: ['id'],
        include: [{ model: UserProfile, as: 'profile', attributes: ['full_name'] }],
      }],
      order: [['created_at', 'DESC']],
    });
    return successResponse(res, feedback);
  } catch (error) { next(error); }
};

// ============================================
// Analytics Controller
// ============================================
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalComplaints, resolvedCount, pendingCount, criticalCount,
      todayCount, avgRating, departmentStats, categoryStats,
    ] = await Promise.all([
      Complaint.count(),
      Complaint.count({ where: { status: { [Op.in]: ['resolved', 'closed'] } } }),
      Complaint.count({ where: { status: { [Op.in]: ['submitted', 'acknowledged', 'assigned', 'in_progress'] } } }),
      Complaint.count({ where: { priority: 'critical', status: { [Op.notIn]: ['resolved', 'closed'] } } }),
      Complaint.count({ where: { created_at: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      Feedback.findOne({ attributes: [[fn('AVG', col('rating')), 'avg_rating']], raw: true }),
      // Complaints per department
      Complaint.findAll({
        attributes: ['assigned_dept_id', [fn('COUNT', col('Complaint.id')), 'count']],
        include: [{ model: Department, as: 'assigned_department', attributes: ['name'] }],
        group: ['assigned_dept_id', 'assigned_department.id', 'assigned_department.name'],
        raw: true, nest: true,
      }),
      // Complaints per category
      Complaint.findAll({
        attributes: ['category_id', [fn('COUNT', col('Complaint.id')), 'count']],
        include: [{ model: Category, as: 'category', attributes: ['name', 'name_ta', 'icon'] }],
        group: ['category_id', 'category.id', 'category.name', 'category.name_ta', 'category.icon'],
        raw: true, nest: true,
      }),
    ]);

    const resolutionRate = totalComplaints > 0
      ? ((resolvedCount / totalComplaints) * 100).toFixed(1)
      : 0;

    return successResponse(res, {
      overview: {
        total: totalComplaints,
        resolved: resolvedCount,
        pending: pendingCount,
        critical: criticalCount,
        today: todayCount,
        resolution_rate: parseFloat(resolutionRate),
        avg_rating: parseFloat(avgRating?.avg_rating || 0).toFixed(1),
      },
      by_department: departmentStats,
      by_category: categoryStats,
    });
  } catch (error) { next(error); }
};

export const getHeatmapData = async (req, res, next) => {
  try {
    const complaints = await Complaint.findAll({
      attributes: ['latitude', 'longitude', 'priority', 'status'],
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
      },
      raw: true,
    });

    const heatmapData = complaints.map((c) => ({
      lat: parseFloat(c.latitude),
      lng: parseFloat(c.longitude),
      intensity: { low: 0.3, medium: 0.5, high: 0.7, critical: 1.0 }[c.priority] || 0.5,
    }));

    return successResponse(res, heatmapData);
  } catch (error) { next(error); }
};

export const getSLAData = async (req, res, next) => {
  try {
    const complaints = await Complaint.findAll({
      where: {
        status: { [Op.notIn]: ['closed', 'rejected'] },
        resolution_eta: { [Op.ne]: null },
      },
      include: [
        { model: Category, as: 'category', attributes: ['name', 'sla_hours'] },
        { model: Department, as: 'assigned_department', attributes: ['name'] },
      ],
      order: [['resolution_eta', 'ASC']],
    });

    const now = new Date();
    const slaData = complaints.map((c) => {
      const eta = new Date(c.resolution_eta);
      const isBreached = now > eta && !['resolved', 'closed'].includes(c.status);
      const hoursRemaining = Math.max(0, (eta - now) / (1000 * 60 * 60));
      return {
        id: c.id,
        complaint_number: c.complaint_number,
        title: c.title,
        priority: c.priority,
        category: c.category?.name,
        department: c.assigned_department?.name,
        resolution_eta: c.resolution_eta,
        is_breached: isBreached,
        hours_remaining: hoursRemaining.toFixed(1),
      };
    });

    const breached = slaData.filter((s) => s.is_breached).length;
    const onTrack = slaData.length - breached;

    return successResponse(res, {
      summary: { total: slaData.length, breached, on_track: onTrack },
      complaints: slaData,
    });
  } catch (error) { next(error); }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const months = 6;
    const trends = [];
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date();
      start.setMonth(start.getMonth() - i, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      const [total, resolved] = await Promise.all([
        Complaint.count({ where: { created_at: { [Op.between]: [start, end] } } }),
        Complaint.count({ where: { resolved_at: { [Op.between]: [start, end] } } }),
      ]);

      trends.push({
        month: start.toLocaleString('en', { month: 'short', year: 'numeric' }),
        filed: total,
        resolved,
      });
    }

    return successResponse(res, trends);
  } catch (error) { next(error); }
};

// ============================================
// Audit Controller
// ============================================
export const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action, model_name, user_id } = req.query;
    const where = {};
    if (action) where.action = action;
    if (model_name) where.model_name = model_name;
    if (user_id) where.user_id = user_id;

    const { offset, limit: lim } = getPagination(page, limit);
    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [{
        model: User, as: 'user', attributes: ['id', 'email'],
        include: [{ model: UserProfile, as: 'profile', attributes: ['full_name'] }],
      }],
      order: [['created_at', 'DESC']],
      limit: lim,
      offset,
    });

    return paginatedResponse(res, rows, count, page, lim);
  } catch (error) { next(error); }
};

// ============================================
// Admin Controller
// ============================================
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { '$profile.full_name$': { [Op.like]: `%${search}%` } },
      ];
    }

    const { offset, limit: lim } = getPagination(page, limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      include: [{ model: UserProfile, as: 'profile' }],
      order: [['created_at', 'DESC']],
      limit: lim,
      offset,
      subQuery: false,
    });

    return paginatedResponse(res, rows, count, page, lim);
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return notFoundResponse(res, 'User');

    const { role, is_active } = req.body;
    if (role) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;
    await user.save();

    return successResponse(res, user.toSafeJSON(), 'User updated');
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return notFoundResponse(res, 'User');
    await user.update({ is_active: false });
    return successResponse(res, null, 'User deactivated');
  } catch (error) { next(error); }
};

// ============================================
// AI Controller
// ============================================
export const validateImage = async (req, res, next) => {
  try {
    // Rule-based image validation for demo
    if (!req.file) return errorResponse(res, 'No image provided', 400);

    const result = {
      is_valid: true,
      confidence: 0.85,
      detected_objects: ['civic_issue'],
      is_fake: false,
      validation_notes: 'Image appears to be a genuine civic issue photo',
    };

    // Basic checks
    if (req.file.size < 10000) { // Less than 10KB likely not genuine
      result.is_valid = false;
      result.confidence = 0.3;
      result.validation_notes = 'Image file size too small — may not be genuine';
    }

    return successResponse(res, result, 'Image validated');
  } catch (error) { next(error); }
};

export const predictCategory = async (req, res, next) => {
  try {
    const { description, title } = req.body;
    if (!description && !title) return errorResponse(res, 'Description or title required', 400);

    const text = `${title || ''} ${description || ''}`.toLowerCase();

    // Keyword-based category prediction
    const predictions = [
      { category: 'Pothole', keywords: ['pothole', 'pit', 'hole', 'road damage', 'crater'], score: 0 },
      { category: 'Garbage Dump', keywords: ['garbage', 'waste', 'trash', 'dump', 'litter', 'rubbish'], score: 0 },
      { category: 'Water Leakage', keywords: ['water', 'leak', 'pipe', 'burst', 'flooding', 'drip'], score: 0 },
      { category: 'Streetlight Failure', keywords: ['streetlight', 'light', 'lamp', 'dark', 'bulb', 'pole'], score: 0 },
      { category: 'Drainage Block', keywords: ['drain', 'block', 'clog', 'gutter', 'stagnant'], score: 0 },
      { category: 'Sewage Overflow', keywords: ['sewage', 'sewer', 'overflow', 'smell', 'stink'], score: 0 },
      { category: 'Road Damage', keywords: ['road', 'crack', 'broken', 'surface', 'pavement'], score: 0 },
      { category: 'Encroachment', keywords: ['encroachment', 'illegal', 'construction', 'occupy'], score: 0 },
    ];

    predictions.forEach((p) => {
      p.score = p.keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    });

    predictions.sort((a, b) => b.score - a.score);
    const topPrediction = predictions[0];

    return successResponse(res, {
      predicted_category: topPrediction.category,
      confidence: Math.min(topPrediction.score / 3, 1.0).toFixed(2),
      alternatives: predictions.slice(1, 3).map((p) => ({
        category: p.category,
        confidence: Math.min(p.score / 3, 1.0).toFixed(2),
      })),
    });
  } catch (error) { next(error); }
};

export const predictSeverity = async (req, res, next) => {
  try {
    const { description, category, is_emergency } = req.body;
    let score = 0.5;

    if (is_emergency) score = 1.0;

    const text = (description || '').toLowerCase();
    const urgentWords = ['urgent', 'emergency', 'danger', 'flood', 'collapse', 'fire', 'accident'];
    const highWords = ['broken', 'damage', 'overflow', 'leak', 'major'];
    const mediumWords = ['complaint', 'issue', 'problem', 'repair'];

    urgentWords.forEach((w) => { if (text.includes(w)) score += 0.15; });
    highWords.forEach((w) => { if (text.includes(w)) score += 0.08; });
    mediumWords.forEach((w) => { if (text.includes(w)) score += 0.03; });

    score = Math.min(score, 1.0);

    let priority = 'medium';
    if (score >= 0.8) priority = 'critical';
    else if (score >= 0.6) priority = 'high';
    else if (score >= 0.3) priority = 'medium';
    else priority = 'low';

    return successResponse(res, {
      severity_score: score.toFixed(2),
      predicted_priority: priority,
      estimated_resolution_hours: { critical: 4, high: 24, medium: 48, low: 72 }[priority],
    });
  } catch (error) { next(error); }
};
