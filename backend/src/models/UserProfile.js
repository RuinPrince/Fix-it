// ============================================
// Fix It — UserProfile Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
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
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'user_profiles',
});

export default UserProfile;
