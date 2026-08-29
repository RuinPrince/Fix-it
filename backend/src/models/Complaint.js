// ============================================
// Fix It — Complaint Model (Core)
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  complaint_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
    comment: 'Auto-generated: FIX-YYYY-NNNNN',
  },
  citizen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'categories', key: 'id' },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { len: [5, 255] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { len: [10, 5000] },
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ward_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'wards', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened'),
    defaultValue: 'submitted',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  assigned_dept_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'departments', key: 'id' },
  },
  assigned_official_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_emergency: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ai_severity_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'AI-predicted severity (0.0 to 1.0)',
  },
  ai_category_prediction: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  duplicate_of_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'complaints', key: 'id' },
    comment: 'Points to original complaint if this is a duplicate',
  },
  qr_code_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  resolution_eta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  internal_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes visible only to officials/admins',
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'complaints',
  indexes: [
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['citizen_id'] },
    { fields: ['category_id'] },
    { fields: ['ward_id'] },
    { fields: ['assigned_dept_id'] },
    { fields: ['assigned_official_id'] },
    { fields: ['created_at'] },
    { fields: ['complaint_number'] },
  ],
  hooks: {
    // Auto-generate complaint number after creation
    afterCreate: async (complaint) => {
      if (!complaint.complaint_number) {
        const year = new Date().getFullYear();
        complaint.complaint_number = `FIX-${year}-${String(complaint.id).padStart(5, '0')}`;
        await complaint.save({ hooks: false });
      }
    },
  },
});

export default Complaint;
