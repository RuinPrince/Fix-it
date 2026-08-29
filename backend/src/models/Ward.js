// ============================================
// Fix It — Ward Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ward = sequelize.define('Ward', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  boundary_geojson: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'GeoJSON polygon defining ward boundary',
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'departments', key: 'id' },
  },
}, {
  tableName: 'wards',
});

export default Ward;
