const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    defaultValue: 'info',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  updatedAt: false,
});

Notification.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  values.user = values.userId;
  return values;
};

// Relationships
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = Notification;
