const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 5000 },
      currency: { type: String, default: 'EUR' }
    },
    performance: {
      importance: { type: Number, min: 1, max: 10, default: 5 },
      usage: [String] // ['gaming', 'video_editing', 'coding', 'office']
    },
    portability: {
      importance: { type: Number, min: 1, max: 10, default: 5 },
      maxWeight: { type: Number, default: 2.5 }
    },
    display: {
      importance: { type: Number, min: 1, max: 10, default: 5 },
      minSize: { type: Number, default: 13 },
      touchscreen: { type: Boolean, default: false },
      highRefreshRate: { type: Boolean, default: false }
    },
    battery: {
      importance: { type: Number, min: 1, max: 10, default: 5 },
      minHours: { type: Number, default: 6 }
    }
  },
  viewedLaptops: [{
    laptopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laptop' },
    viewedAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5 }
  }],
  savedLaptops: [{
    laptopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laptop' },
    savedAt: { type: Date, default: Date.now },
    note: String
  }],
  searchHistory: [{
    query: String,
    filters: mongoose.Schema.Types.Mixed,
    searchedAt: { type: Date, default: Date.now }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated on save
userPreferenceSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);