const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Product = sequelize.define('Product', {
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  discountPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subcategory: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  barcode: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  photos: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  brand: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  size: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  material: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  weight: {
    type: DataTypes.JSONB,
    defaultValue: {
      value: 0,
      unit: 'kg',
    },
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm',
    },
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'out_of_stock', 'discontinued'),
    defaultValue: 'active',
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  vendor: {
    type: DataTypes.JSONB,
    defaultValue: {
      name: '',
      email: '',
      phone: '',
    },
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  rating: {
    type: DataTypes.JSONB,
    defaultValue: {
      average: 0,
      count: 0,
    },
  },
  salesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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

Product.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  values.name = values.title;
  if (values.creatorUser !== undefined) {
    values.createdBy = values.creatorUser;
  }
  return values;
};

// Relationships
Product.belongsTo(User, { as: 'creatorUser', foreignKey: 'createdBy', constraints: false });

module.exports = Product;
