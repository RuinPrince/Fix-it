// ============================================
// Fix It — User Model
// ============================================
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('citizen', 'official', 'admin', 'super_admin'),
    defaultValue: 'citizen',
  },
  firebase_uid: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reputation_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  language_pref: {
    type: DataTypes.ENUM('en', 'ta'),
    defaultValue: 'en',
  },
  fcm_token: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  hooks: {
    // Hash password before creating user
    beforeCreate: async (user) => {
      if (user.password_hash && !user.password_hash.startsWith('$2')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
    },
    // Hash password before updating if changed
    beforeUpdate: async (user) => {
      if (user.changed('password_hash') && !user.password_hash.startsWith('$2')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
    },
  },
});

/**
 * Verify password against stored hash
 */
User.prototype.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

/**
 * Return user data without sensitive fields
 */
User.prototype.toSafeJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  delete values.firebase_uid;
  delete values.fcm_token;
  return values;
};

export default User;
