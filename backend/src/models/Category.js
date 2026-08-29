// ============================================
// Fix It — Category Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  name_ta: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Tamil name for multilingual support',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(100),
    defaultValue: 'report',
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'departments', key: 'id' },
  },
  sla_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 48,
    comment: 'Service Level Agreement in hours',
  },
  priority_weight: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Higher weight = higher default priority',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'categories',
});

export default Category;
