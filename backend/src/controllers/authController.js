// ============================================
// Fix It — Auth Controller
// ============================================
import { User, UserProfile } from '../models/index.js';
import { generateTokens, verifyRefreshToken } from '../middleware/auth.js';
import { successResponse, createdResponse, errorResponse, unauthorizedResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/audit.js';
import logger from '../utils/logger.js';

/**
 * POST /api/v1/auth/register
 * Register a new citizen
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, phone, full_name, language_pref } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return errorResponse(res, 'Email is already registered', 409);
    }

    // Create user
    const user = await User.create({
      email,
      password_hash: password, // Hook will hash it
      phone: phone || null,
      language_pref: language_pref || 'en',
      role: 'citizen',
    });

    // Create profile
    await UserProfile.create({
      user_id: user.id,
      full_name,
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Audit log
    await createAuditLog(user.id, 'REGISTER', 'users', user.id);

    const userData = user.toSafeJSON();
    userData.full_name = full_name;

    return createdResponse(res, {
      user: userData,
      ...tokens,
    }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: UserProfile, as: 'profile' }],
    });

    if (!user) {
      return unauthorizedResponse(res, 'Invalid email or password');
    }

    if (!user.is_active) {
      return errorResponse(res, 'Account is deactivated — contact admin', 403);
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return unauthorizedResponse(res, 'Invalid email or password');
    }

    // Update last login
    await user.update({ last_login: new Date() });

    const tokens = generateTokens(user);
    await createAuditLog(user.id, 'LOGIN', 'users', user.id);

    const userData = user.toSafeJSON();
    userData.profile = user.profile;

    return successResponse(res, {
      user: userData,
      ...tokens,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return errorResponse(res, 'Refresh token is required', 400);
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return unauthorizedResponse(res, 'User not found or deactivated');
    }

    const tokens = generateTokens(user);

    return successResponse(res, tokens, 'Token refreshed');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, 'Refresh token expired — please login again');
    }
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    // Clear FCM token on logout
    if (req.user) {
      await req.user.update({ fcm_token: null });
      await createAuditLog(req.user.id, 'LOGOUT', 'users', req.user.id);
    }
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/profile
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{ model: UserProfile, as: 'profile' }],
    });

    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/auth/profile
 * Update current user profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, address, ward_id, language_pref, fcm_token } = req.body;

    // Update user fields
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (language_pref) updateData.language_pref = language_pref;
    if (fcm_token !== undefined) updateData.fcm_token = fcm_token;

    if (Object.keys(updateData).length > 0) {
      await User.update(updateData, { where: { id: req.userId }, individualHooks: true });
    }

    // Update profile fields
    const profileUpdate = {};
    if (full_name) profileUpdate.full_name = full_name;
    if (address !== undefined) profileUpdate.address = address;
    if (ward_id !== undefined) profileUpdate.ward_id = ward_id;

    if (Object.keys(profileUpdate).length > 0) {
      await UserProfile.update(profileUpdate, { where: { user_id: req.userId } });
    }

    // Fetch updated user
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{ model: UserProfile, as: 'profile' }],
    });

    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export default { register, login, refreshToken, logout, getProfile, updateProfile };
