const mongoose = require('mongoose');

const predictionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: String,
  inputData: {
    ram: Number,
    weight: Number,
    company: String,
    typename: String,
    opsys: String,
    cpu: String,
    gpu: String,
    touchscreen: Boolean,
    ips: Boolean
  },
  predictionResult: {
    price_euros: Number,
    price_pkr: Number,
    confidence: { type: Number, default: 0.8 }
  },
  recommendations: [{
    laptopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laptop' },
    similarityScore: Number,
    reason: String
  }],
  feedback: {
    accuracy: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
predictionHistorySchema.index({ userId: 1, createdAt: -1 });
predictionHistorySchema.index({ sessionId: 1 });
predictionHistorySchema.index({ 'inputData.company': 1 });
predictionHistorySchema.index({ 'predictionResult.price_euros': 1 });

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);