const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tender = sequelize.define('Tender', {
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
    allowNull: false,
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'IT & Software',
      'Hardware & Equipment',
      'Office Supplies',
      'Infrastructure',
      'Consulting Services',
      'Maintenance',
      'Other'
    ),
    allowNull: false,
  },
  tenderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gemTenderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estimatedValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  openingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Closed', 'Under Evaluation', 'Awarded'),
    defaultValue: 'Active',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  eligibility: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  termsConditions: {
    type: DataTypes.TEXT,
    allowNull: false,
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

Tender.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Tender;
