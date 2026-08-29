// ============================================
// Fix It — AuditLog Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g. CREATE, UPDATE, DELETE, LOGIN, ASSIGN',
  },
  model_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  object_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'audit_logs',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['action'] },
    { fields: ['model_name', 'object_id'] },
    { fields: ['created_at'] },
  ],
});

export default AuditLog;
