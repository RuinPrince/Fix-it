// ============================================
// Fix It — Notification Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  complaint_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'complaints', key: 'id' },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('status_update', 'assignment', 'escalation', 'chat', 'system', 'badge'),
    defaultValue: 'system',
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data payload for the notification',
  },
}, {
  tableName: 'notifications',
  updatedAt: false,
  indexes: [
    { fields: ['user_id', 'is_read'] },
    { fields: ['created_at'] },
  ],
});

export default Notification;
