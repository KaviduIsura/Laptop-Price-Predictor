const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// All user routes require authentication
router.use(authMiddleware.protect);

// User dashboard and data
router.get('/dashboard', userController.getDashboard);
router.get('/activity', userController.getActivity);
router.put('/settings', userController.updateSettings);
router.get('/export', userController.exportData);
router.delete('/account', userController.deleteAccount);

module.exports = router;