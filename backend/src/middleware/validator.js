// ============================================
// Fix It — Input Validation Middleware (Joi)
// ============================================
import Joi from 'joi';
import { validationErrorResponse } from '../utils/response.js';

/**
 * Generic validation middleware factory
 * Usage: validate(schema, 'body')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));
      return validationErrorResponse(res, errors);
    }

    req[source] = value;
    next();
  };
};

// ============================================
// Validation Schemas
// ============================================

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s-]{10,15}$/).allow('', null).messages({
    'string.pattern.base': 'Please provide a valid phone number',
  }),
  full_name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Full name is required',
  }),
  language_pref: Joi.string().valid('en', 'ta').default('en'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const complaintSchema = Joi.object({
  title: Joi.string().min(5).max(255).required().messages({
    'string.min': 'Title must be at least 5 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(10).max(5000).required().messages({
    'string.min': 'Description must be at least 10 characters',
    'any.required': 'Description is required',
  }),
  category_id: Joi.number().integer().positive().required(),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  address: Joi.string().max(1000).allow('', null),
  ward_id: Joi.number().integer().positive().allow(null),
  is_anonymous: Joi.boolean().default(false),
  is_emergency: Joi.boolean().default(false),
});

export const statusUpdateSchema = Joi.object({
  status: Joi.string().valid(
    'submitted', 'acknowledged', 'assigned', 'in_progress',
    'resolved', 'closed', 'rejected', 'reopened'
  ).required(),
  notes: Joi.string().max(1000).allow('', null),
});

export const assignSchema = Joi.object({
  department_id: Joi.number().integer().positive().allow(null),
  official_id: Joi.number().integer().positive().allow(null),
  notes: Joi.string().max(1000).allow('', null),
});

export const feedbackSchema = Joi.object({
  complaint_id: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow('', null),
});

export const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  message_type: Joi.string().valid('text', 'image').default('text'),
});

export const departmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('', null),
  contact_email: Joi.string().email().allow('', null),
  contact_phone: Joi.string().max(20).allow('', null),
  head_user_id: Joi.number().integer().positive().allow(null),
});

export const wardSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  number: Joi.number().integer().positive().required(),
  department_id: Joi.number().integer().positive().allow(null),
  boundary_geojson: Joi.string().allow('', null),
});

export const bulkAssignSchema = Joi.object({
  complaint_ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(100).required(),
  department_id: Joi.number().integer().positive().allow(null),
  official_id: Joi.number().integer().positive().allow(null),
});

export const escalateSchema = Joi.object({
  reason: Joi.string().min(5).max(1000).required(),
  escalated_to_id: Joi.number().integer().positive().allow(null),
});

export const profileUpdateSchema = Joi.object({
  full_name: Joi.string().min(2).max(255),
  phone: Joi.string().pattern(/^[+]?[\d\s-]{10,15}$/).allow('', null),
  address: Joi.string().max(500).allow('', null),
  ward_id: Joi.number().integer().positive().allow(null),
  language_pref: Joi.string().valid('en', 'ta'),
  fcm_token: Joi.string().max(500).allow('', null),
});

export default {
  validate,
  registerSchema,
  loginSchema,
  complaintSchema,
  statusUpdateSchema,
  assignSchema,
  feedbackSchema,
  chatMessageSchema,
  departmentSchema,
  wardSchema,
  bulkAssignSchema,
  escalateSchema,
  profileUpdateSchema,
};
