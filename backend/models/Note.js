const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#fff740',
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

Note.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  values.user = values.userId;
  return values;
};

// Relationships
Note.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = Note;
