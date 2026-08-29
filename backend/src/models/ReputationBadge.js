// ============================================
// Fix It — ReputationBadge & Escalation Models
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const ReputationBadge = sequelize.define('ReputationBadge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(100),
    defaultValue: 'badge',
  },
  points_required: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  badge_type: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze',
  },
}, {
  tableName: 'reputation_badges',
  updatedAt: false,
});

export const UserBadge = sequelize.define('UserBadge', {
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
  badge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'reputation_badges', key: 'id' },
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_badges',
  timestamps: false,
});

export const Escalation = sequelize.define('Escalation', {
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
  escalated_from_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  escalated_to_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'escalations',
  updatedAt: false,
});
