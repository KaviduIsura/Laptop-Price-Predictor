const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const validation = require('../middlewares/validationMiddleware');

// Public routes
router.post('/register', validation.authValidation.register, authController.register);
router.post('/login', validation.authValidation.login, authController.login);

// Protected routes
router.get('/me', authMiddleware.protect, authController.getMe);
router.put('/profile', authMiddleware.protect, authController.updateProfile);
router.put('/preferences', authMiddleware.protect, authController.updatePreferences);

module.exports = router;