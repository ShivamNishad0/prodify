const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'IT & Software',
      'Hardware & Equipment',
      'Office Supplies',
      'Infrastructure',
      'Consulting Services',
      'Maintenance',
      'Other'
    ]
  },
  tenderId: {
    type: String,
    required: true,
    unique: true
  },
  gemTenderId: {
    type: String,
    required: true
  },
  estimatedValue: {
    type: Number,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  openingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Under Evaluation', 'Awarded'],
    default: 'Active'
  },
  location: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  documents: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['tender', 'specification', 'corrigendum']
    }
  }],
  eligibility: {
    type: String,
    required: true
  },
  termsConditions: {
    type: String,
    required: true
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

tenderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Tender', tenderSchema);
