const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  photos: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: ''
  },
  weight: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'kg'
    }
  },
  dimensions: {
    length: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'cm'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  tags: [{
    type: String
  }],
  vendor: {
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  specifications: [{
    key: {
      type: String
    },
    value: {
      type: String
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

