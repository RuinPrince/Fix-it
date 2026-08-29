// ============================================
// Fix It — StatusHistory Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StatusHistory = sequelize.define('StatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  complaint_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'complaints', key: 'id' },
  },
  old_status: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  new_status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  changed_by_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'status_history',
  updatedAt: false,
});

export default StatusHistory;
