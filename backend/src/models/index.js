// ============================================
// Fix It — Model Index: Associations & Exports
// ============================================
import User from './User.js';
import UserProfile from './UserProfile.js';
import Department from './Department.js';
import Ward from './Ward.js';
import Category from './Category.js';
import Complaint from './Complaint.js';
import ComplaintImage from './ComplaintImage.js';
import StatusHistory from './StatusHistory.js';
import Notification from './Notification.js';
import { ChatRoom, ChatMessage } from './ChatRoom.js';
import Feedback from './Feedback.js';
import AuditLog from './AuditLog.js';
import { ReputationBadge, UserBadge, Escalation } from './ReputationBadge.js';

// ============================================
// Define All Associations
// ============================================

// User <-> UserProfile (1:1)
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Ward (M:1)
UserProfile.belongsTo(Ward, { foreignKey: 'ward_id', as: 'ward' });
Ward.hasMany(UserProfile, { foreignKey: 'ward_id', as: 'residents' });

// Department <-> User (Head)
Department.belongsTo(User, { foreignKey: 'head_user_id', as: 'head' });

// Department <-> Ward (1:M)
Department.hasMany(Ward, { foreignKey: 'department_id', as: 'wards' });
Ward.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Department <-> Category (1:M)
Department.hasMany(Category, { foreignKey: 'department_id', as: 'categories' });
Category.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// User <-> Complaint (1:M) — citizen
User.hasMany(Complaint, { foreignKey: 'citizen_id', as: 'filed_complaints' });
Complaint.belongsTo(User, { foreignKey: 'citizen_id', as: 'citizen' });

// Complaint <-> Category (M:1)
Category.hasMany(Complaint, { foreignKey: 'category_id', as: 'complaints' });
Complaint.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Complaint <-> Ward (M:1)
Ward.hasMany(Complaint, { foreignKey: 'ward_id', as: 'complaints' });
Complaint.belongsTo(Ward, { foreignKey: 'ward_id', as: 'ward' });

// Complaint <-> Department (M:1) — assignment
Department.hasMany(Complaint, { foreignKey: 'assigned_dept_id', as: 'assigned_complaints' });
Complaint.belongsTo(Department, { foreignKey: 'assigned_dept_id', as: 'assigned_department' });

// Complaint <-> User (M:1) — assigned official
Complaint.belongsTo(User, { foreignKey: 'assigned_official_id', as: 'assigned_official' });

// Complaint <-> Complaint (self-ref for duplicates)
Complaint.belongsTo(Complaint, { foreignKey: 'duplicate_of_id', as: 'original_complaint' });
Complaint.hasMany(Complaint, { foreignKey: 'duplicate_of_id', as: 'duplicates' });

// Complaint <-> ComplaintImage (1:M)
Complaint.hasMany(ComplaintImage, { foreignKey: 'complaint_id', as: 'images' });
ComplaintImage.belongsTo(Complaint, { foreignKey: 'complaint_id', as: 'complaint' });

// Complaint <-> StatusHistory (1:M)
Complaint.hasMany(StatusHistory, { foreignKey: 'complaint_id', as: 'status_history' });
StatusHistory.belongsTo(Complaint, { foreignKey: 'complaint_id', as: 'complaint' });
StatusHistory.belongsTo(User, { foreignKey: 'changed_by_id', as: 'changed_by' });

// User <-> Notification (1:M)
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Notification.belongsTo(Complaint, { foreignKey: 'complaint_id', as: 'complaint' });

// Complaint <-> ChatRoom (1:1)
Complaint.hasOne(ChatRoom, { foreignKey: 'complaint_id', as: 'chat_room' });
ChatRoom.belongsTo(Complaint, { foreignKey: 'complaint_id', as: 'complaint' });
ChatRoom.belongsTo(User, { foreignKey: 'citizen_id', as: 'citizen' });
ChatRoom.belongsTo(User, { foreignKey: 'official_id', as: 'official' });

// ChatRoom <-> ChatMessage (1:M)
ChatRoom.hasMany(ChatMessage, { foreignKey: 'room_id', as: 'messages' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'room_id', as: 'room' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Complaint <-> Feedback (1:M)
Complaint.hasMany(Feedback, { foreignKey: 'complaint_id', as: 'feedback' });
Feedback.belongsTo(Complaint, { foreignKey: 'complaint_id', as: 'complaint' });
Feedback.belongsTo(User, { foreignKey: 'citizen_id', as: 'citizen' });

// User <-> AuditLog (1:M)
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> ReputationBadge (M:M via UserBadge)
User.belongsToMany(ReputationBadge, { through: UserBadge, foreignKey: 'user_id', as: 'badges' });
ReputationBadge.belongsToMany(User, { through: UserBadge, foreignKey: 'badge_id', as: 'users' });

// Complaint <-> Escalation (1:M)
Complaint.hasMany(Escalation, { foreignKey: 'complaint_id', as: 'escalations' });
Escalation.belongsTo(Complaint, { foreignKey: 'complaint_id', as: 'complaint' });
Escalation.belongsTo(User, { foreignKey: 'escalated_from_id', as: 'escalated_from' });
Escalation.belongsTo(User, { foreignKey: 'escalated_to_id', as: 'escalated_to' });

// ============================================
// Export all models
// ============================================
const db = {
  User,
  UserProfile,
  Department,
  Ward,
  Category,
  Complaint,
  ComplaintImage,
  StatusHistory,
  Notification,
  ChatRoom,
  ChatMessage,
  Feedback,
  AuditLog,
  ReputationBadge,
  UserBadge,
  Escalation,
};

export default db;
export {
  User,
  UserProfile,
  Department,
  Ward,
  Category,
  Complaint,
  ComplaintImage,
  StatusHistory,
  Notification,
  ChatRoom,
  ChatMessage,
  Feedback,
  AuditLog,
  ReputationBadge,
  UserBadge,
  Escalation,
};
