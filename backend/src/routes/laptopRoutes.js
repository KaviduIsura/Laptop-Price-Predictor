const express = require('express');
const router = express.Router();
const laptopController = require('../controllers/laptopController');
const authMiddleware = require('../middlewares/authMiddleware');
const validation = require('../middlewares/validationMiddleware');

// Public routes
router.get('/', laptopController.getAllLaptops);
router.get('/search', laptopController.searchLaptops);
router.get('/:id', laptopController.getLaptopById);
router.get('/brand/:brand', laptopController.getLaptopsByBrand);
router.get('/category/:category', laptopController.getLaptopsByCategory);

// Filter laptops (public)
router.post('/filter', laptopController.filterLaptops);

// Admin/protected routes
router.post('/', authMiddleware.protect, authMiddleware.adminOnly, laptopController.createLaptop);
router.put('/:id', authMiddleware.protect, authMiddleware.adminOnly, laptopController.updateLaptop);
router.delete('/:id', authMiddleware.protect, authMiddleware.adminOnly, laptopController.deleteLaptop);
router.post('/bulk', authMiddleware.protect, authMiddleware.adminOnly, laptopController.bulkCreateLaptops);

module.exports = router;