const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Not required for Keycloak users
  },
  role: {
    type: DataTypes.ENUM('admin', 'employee', 'manager', 'tl'),
    defaultValue: 'employee',
  },
  keycloakId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'keycloak'),
    defaultValue: 'local',
  },
  isWebsiteUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  gender: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  company: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  socialMedia: {
    type: DataTypes.JSONB,
    defaultValue: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
  },
  // Compatibility virtual for mongoose _id
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.id;
    },
  },
}, {
  timestamps: true,
});

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  values._id = values.id;
  return values;
};

module.exports = User;
