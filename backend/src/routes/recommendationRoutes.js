const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

// All recommendation routes require authentication
router.use(authMiddleware.protect);

// Get recommendations
router.get('/personalized', recommendationController.getPersonalizedRecommendations);
router.get('/collaborative', recommendationController.getCollaborativeRecommendations);
router.get('/similar/:laptopId', recommendationController.getSimilarLaptops);
router.get('/content-based/:laptopId', recommendationController.getContentBasedRecommendations);

// Track interactions
router.post('/track', recommendationController.trackInteraction);

module.exports = router;