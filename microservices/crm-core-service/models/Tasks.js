const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assignedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  parentTaskId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Pending',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#fff740',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
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

Task.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  values.user = values.userId;
  if (values.assignedTo === undefined && values.assignedToId !== undefined) {
    values.assignedTo = values.assignedToId;
  }
  if (values.assignedBy === undefined && values.assignedById !== undefined) {
    values.assignedBy = values.assignedById;
  }
  if (values.parentTask === undefined && values.parentTaskId !== undefined) {
    values.parentTask = values.parentTaskId;
  }
  return values;
};

// Relationships
Task.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Task.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId', constraints: false });
Task.belongsTo(User, { as: 'assignedBy', foreignKey: 'assignedById', constraints: false });
Task.belongsTo(Task, { as: 'parentTask', foreignKey: 'parentTaskId', constraints: false });

module.exports = Task;
