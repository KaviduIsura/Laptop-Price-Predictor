const Laptop = require('../models/Laptop');

const laptopController = {
  // Get all laptops with pagination and filters
  getAllLaptops: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        brand,
        category,
        minPrice,
        maxPrice,
        minRam,
        maxRam
      } = req.query;

      // Build query
      const query = {};
      
      if (brand) query.brand = { $in: brand.split(',') };
      if (category) query.category = { $in: category.split(',') };
      
      // Price filter
      if (minPrice || maxPrice) {
        query['price.current'] = {};
        if (minPrice) query['price.current'].$gte = Number(minPrice);
        if (maxPrice) query['price.current'].$lte = Number(maxPrice);
      }
      
      // RAM filter
      if (minRam || maxRam) {
        query['specifications.ram'] = {};
        if (minRam) query['specifications.ram'].$gte = Number(minRam);
        if (maxRam) query['specifications.ram'].$lte = Number(maxRam);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const laptops = await Laptop.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select('-__v');

      // Get total count for pagination
      const total = await Laptop.countDocuments(query);

      res.json({
        success: true,
        count: laptops.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        laptops
      });

    } catch (error) {
      console.error('Get laptops error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch laptops'
      });
    }
  },

  // Get laptop by ID
  getLaptopById: async (req, res) => {
    try {
      const laptop = await Laptop.findById(req.params.id)
        .populate('reviews.userId', 'name email')
        .select('-__v');

      if (!laptop) {
        return res.status(404).json({
          success: false,
          error: 'Laptop not found'
        });
      }

      res.json({
        success: true,
        laptop
      });

    } catch (error) {
      console.error('Get laptop error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch laptop'
      });
    }
  },

  // Search laptops
  searchLaptops: async (req, res) => {
    try {
      const { q, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const laptops = await Laptop.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
          { model: { $regex: q, $options: 'i' } },
          { 'specifications.processor': { $regex: q, $options: 'i' } },
          { 'specifications.gpu': { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      })
      .limit(Number(limit))
      .select('name brand price.current specifications.ram specifications.processor images');

      res.json({
        success: true,
        count: laptops.length,
        laptops
      });

    } catch (error) {
      console.error('Search laptops error:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed'
      });
    }
  },

  // Filter laptops (advanced filtering)
  filterLaptops: async (req, res) => {
    try {
      const filters = req.body;
      const query = {};

      // Brand filter
      if (filters.brands && filters.brands.length > 0) {
        query.brand = { $in: filters.brands };
      }

      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        query.category = { $in: filters.categories };
      }

      // Price range filter
      if (filters.priceRange) {
        query['price.current'] = {
          $gte: filters.priceRange.min || 0,
          $lte: filters.priceRange.max || 10000
        };
      }

      // RAM filter
      if (filters.ram && filters.ram.length > 0) {
        query['specifications.ram'] = { $in: filters.ram.map(r => parseInt(r)) };
      }

      // Storage filter
      if (filters.storage && filters.storage.length > 0) {
        query['specifications.storage'] = {
          $regex: filters.storage.map(s => s.replace('GB', '').replace('TB', '').trim()).join('|'),
          $options: 'i'
        };
      }

      // Processor filter
      if (filters.processors && filters.processors.length > 0) {
        const processorRegex = filters.processors.map(p => 
          p.toLowerCase().replace(/[^a-z0-9]/g, '')
        ).join('|');
        query['specifications.processor'] = {
          $regex: processorRegex,
          $options: 'i'
        };
      }

      // Display size filter
      if (filters.displaySizes && filters.displaySizes.length > 0) {
        query['specifications.displaySize'] = {
          $in: filters.displaySizes.map(size => parseFloat(size))
        };
      }

      // Rating filter
      if (filters.minRating) {
        query['rating.average'] = { $gte: Number(filters.minRating) };
      }

      // Features filter
      if (filters.features) {
        Object.keys(filters.features).forEach(feature => {
          if (filters.features[feature]) {
            query[`features.${feature}`] = true;
          }
        });
      }

      // Execute query
      const laptops = await Laptop.find(query)
        .limit(filters.limit || 50)
        .select('-__v');

      res.json({
        success: true,
        count: laptops.length,
        laptops
      });

    } catch (error) {
      console.error('Filter laptops error:', error);
      res.status(500).json({
        success: false,
        error: 'Filtering failed'
      });
    }
  },

  // Get laptops by brand
  getLaptopsByBrand: async (req, res) => {
    try {
      const { brand } = req.params;
      const { limit = 20 } = req.query;

      const laptops = await Laptop.find({ brand: brand.toLowerCase() })
        .limit(Number(limit))
        .select('-__v');

      res.json({
        success: true,
        count: laptops.length,
        brand,
        laptops
      });

    } catch (error) {
      console.error('Get laptops by brand error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch laptops by brand'
      });
    }
  },

  // Get laptops by category
  getLaptopsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const { limit = 20 } = req.query;

      const laptops = await Laptop.find({ category: category.toLowerCase() })
        .limit(Number(limit))
        .select('-__v');

      res.json({
        success: true,
        count: laptops.length,
        category,
        laptops
      });

    } catch (error) {
      console.error('Get laptops by category error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch laptops by category'
      });
    }
  },

  // Create new laptop (admin only)
  createLaptop: async (req, res) => {
    try {
      const laptopData = req.body;
      
      // Validate required fields
      const requiredFields = ['name', 'brand', 'model', 'specifications', 'price'];
      for (const field of requiredFields) {
        if (!laptopData[field]) {
          return res.status(400).json({
            success: false,
            error: `${field} is required`
          });
        }
      }

      const laptop = await Laptop.create(laptopData);

      res.status(201).json({
        success: true,
        message: 'Laptop created successfully',
        laptop
      });

    } catch (error) {
      console.error('Create laptop error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create laptop'
      });
    }
  },

  // Update laptop (admin only)
  updateLaptop: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const laptop = await Laptop.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!laptop) {
        return res.status(404).json({
          success: false,
          error: 'Laptop not found'
        });
      }

      res.json({
        success: true,
        message: 'Laptop updated successfully',
        laptop
      });

    } catch (error) {
      console.error('Update laptop error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update laptop'
      });
    }
  },

  // Delete laptop (admin only)
  deleteLaptop: async (req, res) => {
    try {
      const { id } = req.params;

      const laptop = await Laptop.findByIdAndDelete(id);

      if (!laptop) {
        return res.status(404).json({
          success: false,
          error: 'Laptop not found'
        });
      }

      res.json({
        success: true,
        message: 'Laptop deleted successfully'
      });

    } catch (error) {
      console.error('Delete laptop error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete laptop'
      });
    }
  },

  // Bulk create laptops (admin only - for seeding)
  bulkCreateLaptops: async (req, res) => {
    try {
      const { laptops } = req.body;

      if (!laptops || !Array.isArray(laptops) || laptops.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Laptops array is required'
        });
      }

      // Validate each laptop
      for (const laptop of laptops) {
        const requiredFields = ['name', 'brand', 'model', 'specifications', 'price'];
        for (const field of requiredFields) {
          if (!laptop[field]) {
            return res.status(400).json({
              success: false,
              error: `${field} is required for all laptops`
            });
          }
        }
      }

      const createdLaptops = await Laptop.insertMany(laptops);

      res.status(201).json({
        success: true,
        message: `${createdLaptops.length} laptops created successfully`,
        count: createdLaptops.length,
        laptops: createdLaptops
      });

    } catch (error) {
      console.error('Bulk create laptops error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create laptops'
      });
    }
  },

  // Get laptop statistics
  getLaptopStats: async (req, res) => {
    try {
      const stats = await Laptop.aggregate([
        {
          $group: {
            _id: null,
            totalLaptops: { $sum: 1 },
            avgPrice: { $avg: '$price.current' },
            minPrice: { $min: '$price.current' },
            maxPrice: { $max: '$price.current' },
            avgRating: { $avg: '$rating.average' }
          }
        },
        {
          $project: {
            _id: 0,
            totalLaptops: 1,
            avgPrice: { $round: ['$avgPrice', 2] },
            minPrice: 1,
            maxPrice: 1,
            avgRating: { $round: ['$avgRating', 2] }
          }
        }
      ]);

      // Get brand distribution
      const brandStats = await Laptop.aggregate([
        {
          $group: {
            _id: '$brand',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price.current' }
          }
        },
        { $sort: { count: -1 } },
        {
          $project: {
            brand: '$_id',
            count: 1,
            avgPrice: { $round: ['$avgPrice', 2] },
            _id: 0
          }
        }
      ]);

      // Get category distribution
      const categoryStats = await Laptop.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        stats: stats[0] || {},
        brandStats,
        categoryStats
      });

    } catch (error) {
      console.error('Get laptop stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get laptop statistics'
      });
    }
  }
};

module.exports = laptopController;