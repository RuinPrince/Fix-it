// ============================================
// Fix It — ComplaintImage Model
// ============================================
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ComplaintImage = sequelize.define('ComplaintImage', {
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
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ai_validated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether AI has validated this image as relevant',
  },
  ai_labels: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'AI-detected labels/objects in the image',
  },
  original_filename: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'File size in bytes',
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'complaint_images',
  timestamps: false,
});

export default ComplaintImage;
