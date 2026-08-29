// ============================================
// Fix It — Feedback Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Feedback = sequelize.define('Feedback', {
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
  citizen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'feedback',
  updatedAt: false,
});

export default Feedback;
