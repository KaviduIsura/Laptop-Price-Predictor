const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');
const authMiddleware = require('../middlewares/authMiddleware');
const validation = require('../middlewares/validationMiddleware');

// Public prediction (with optional auth)
router.post('/', 
  authMiddleware.optionalAuth,
  validation.predictValidation.predict,
  predictController.predictPrice
);

// Protected routes
router.get('/history', authMiddleware.protect, predictController.getPredictionHistory);
router.post('/feedback', authMiddleware.protect, predictController.submitFeedback);

module.exports = router;