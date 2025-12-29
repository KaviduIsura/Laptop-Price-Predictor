const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Laptop name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    enum: ['apple', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'samsung', 'other']
  },
  model: {
    type: String,
    required: true
  },
  specifications: {
    ram: { type: Number, required: true },
    storage: { type: String, required: true },
    processor: { type: String, required: true },
    gpu: { type: String, required: true },
    displaySize: { type: Number, required: true },
    resolution: { type: String, required: true },
    weight: { type: Number, required: true },
    batteryLife: { type: Number, required: true }
  },
  features: {
    touchscreen: { type: Boolean, default: false },
    ips: { type: Boolean, default: false },
    backlitKeyboard: { type: Boolean, default: false },
    fingerprintScanner: { type: Boolean, default: false }
  },
  price: {
    current: { type: Number, required: true },
    original: { type: Number, required: true },
    currency: { type: String, default: 'EUR' }
  },
  category: {
    type: String,
    enum: ['ultrabook', 'gaming', 'workstation', 'budget', 'convertible', 'business'],
    required: true
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  images: [String],
  stock: {
    type: Number,
    default: 0
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

// Indexes for better query performance
laptopSchema.index({ brand: 1, price: 1 });
laptopSchema.index({ category: 1 });
laptopSchema.index({ 'specifications.ram': 1 });
laptopSchema.index({ 'specifications.processor': 1 });

// Update updatedAt on save
laptopSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Laptop', laptopSchema);