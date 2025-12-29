const Laptop = require('../models/Laptop');
const UserPreference = require('../models/UserPreference');
const { spawn } = require('child_process');
const path = require('path');

const recommendationController = {
  // Get personalized recommendations based on user preferences
  getPersonalizedRecommendations: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get user preferences
      const userPrefs = await UserPreference.findOne({ userId });
      if (!userPrefs) {
        return res.status(404).json({
          success: false,
          error: 'User preferences not found'
        });
      }
      
      // Build query based on preferences
      const query = {};
      const sort = {};
      
      // Budget filter
      query['price.current'] = {
        $gte: userPrefs.preferences.budget.min,
        $lte: userPrefs.preferences.budget.max
      };
      
      // Weight filter if portability is important
      if (userPrefs.preferences.portability.importance >= 7) {
        query['specifications.weight'] = {
          $lte: userPrefs.preferences.portability.maxWeight
        };
      }
      
      // Display preferences
      if (userPrefs.preferences.display.touchscreen) {
        query['features.touchscreen'] = true;
      }
      
      // Sort based on importance scores
      const sortFields = [];
      if (userPrefs.preferences.performance.importance >= 7) {
        sortFields.push(['specifications.ram', -1]);
        sortFields.push(['specifications.processor', -1]);
      }
      
      if (userPrefs.preferences.portability.importance >= 7) {
        sortFields.push(['specifications.weight', 1]);
      }
      
      if (userPrefs.preferences.battery.importance >= 7) {
        sortFields.push(['specifications.batteryLife', -1]);
      }
      
      // Execute query
      let laptops = await Laptop.find(query)
        .sort(sortFields)
        .limit(20);
      
      // If we have viewed laptops, prioritize unseen ones
      const viewedLaptopIds = userPrefs.viewedLaptops.map(v => v.laptopId.toString());
      laptops = laptops.filter(laptop => !viewedLaptopIds.includes(laptop._id.toString()));
      
      // Get top 10 recommendations
      const recommendations = laptops.slice(0, 10).map(laptop => ({
        laptop,
        matchScore: calculateMatchScore(laptop, userPrefs.preferences),
        reasons: getRecommendationReasons(laptop, userPrefs.preferences)
      }));
      
      // Sort by match score
      recommendations.sort((a, b) => b.matchScore - a.matchScore);
      
      res.json({
        success: true,
        recommendations: recommendations.slice(0, 8),
        userPreferences: userPrefs.preferences
      });
      
    } catch (error) {
      console.error('Recommendation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommendations'
      });
    }
  },
  
  // Get recommendations based on similar users
  getCollaborativeRecommendations: async (req, res) => {
    try {
      // This would typically use a more sophisticated algorithm
      // For now, we'll use a simple similarity-based approach
      
      const userId = req.user.id;
      
      // Get laptops that similar users have viewed/saved
      const similarUsers = await UserPreference.find({
        userId: { $ne: userId },
        'preferences.usageType': req.user.usageType
      }).limit(5);
      
      const similarLaptopIds = [];
      similarUsers.forEach(user => {
        user.viewedLaptops.forEach(viewed => {
          similarLaptopIds.push(viewed.laptopId);
        });
        user.savedLaptops.forEach(saved => {
          similarLaptopIds.push(saved.laptopId);
        });
      });
      
      // Get unique laptop IDs
      const uniqueLaptopIds = [...new Set(similarLaptopIds)];
      
      // Get laptops
      const laptops = await Laptop.find({
        _id: { $in: uniqueLaptopIds }
      }).limit(10);
      
      res.json({
        success: true,
        recommendations: laptops,
        basedOn: 'users with similar preferences'
      });
      
    } catch (error) {
      console.error('Collaborative recommendation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get collaborative recommendations'
      });
    }
  },
  
  // Get recommendations based on current laptop
  getSimilarLaptops: async (req, res) => {
    try {
      const { laptopId } = req.params;
      
      const laptop = await Laptop.findById(laptopId);
      if (!laptop) {
        return res.status(404).json({
          success: false,
          error: 'Laptop not found'
        });
      }
      
      // Find laptops with similar specifications and price
      const similarLaptops = await Laptop.find({
        _id: { $ne: laptopId },
        $or: [
          { 
            'specifications.ram': laptop.specifications.ram,
            'specifications.processor': { $regex: new RegExp(laptop.specifications.processor.split(' ')[0], 'i') },
            'price.current': {
              $gte: laptop.price.current * 0.7,
              $lte: laptop.price.current * 1.3
            }
          },
          {
            category: laptop.category,
            brand: laptop.brand,
            'price.current': {
              $gte: laptop.price.current * 0.8,
              $lte: laptop.price.current * 1.2
            }
          }
        ]
      }).limit(8);
      
      res.json({
        success: true,
        currentLaptop: {
          name: laptop.name,
          brand: laptop.brand,
          price: laptop.price.current,
          specifications: laptop.specifications
        },
        similarLaptops
      });
      
    } catch (error) {
      console.error('Similar laptops error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to find similar laptops'
      });
    }
  },
  
  // Content-based filtering using ML
  getContentBasedRecommendations: async (req, res) => {
    try {
      const { laptopId } = req.params;
      
      // Call Python ML script for content-based filtering
      const pythonProcess = spawn('python3', [
        path.join(__dirname, '../utils/recommendationEngine.py'),
        'content_based',
        laptopId
      ]);
      
      let result = '';
      let error = '';
      
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error('Recommendation engine error:', error);
          return res.status(500).json({
            success: false,
            error: 'Recommendation engine failed'
          });
        }
        
        try {
          const recommendations = JSON.parse(result);
          res.json({
            success: true,
            recommendations
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          res.status(500).json({
            success: false,
            error: 'Failed to parse recommendations'
          });
        }
      });
      
    } catch (error) {
      console.error('Content-based recommendation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get content-based recommendations'
      });
    }
  },
  
  // Track user interaction
  trackInteraction: async (req, res) => {
    try {
      const { laptopId, interactionType, rating, note } = req.body;
      const userId = req.user.id;
      
      const userPrefs = await UserPreference.findOne({ userId });
      if (!userPrefs) {
        return res.status(404).json({
          success: false,
          error: 'User preferences not found'
        });
      }
      
      if (interactionType === 'view') {
        // Add to viewed laptops if not already there
        const alreadyViewed = userPrefs.viewedLaptops.find(
          v => v.laptopId.toString() === laptopId
        );
        
        if (!alreadyViewed) {
          userPrefs.viewedLaptops.push({
            laptopId,
            viewedAt: new Date(),
            rating
          });
        }
      } else if (interactionType === 'save') {
        // Add to saved laptops
        userPrefs.savedLaptops.push({
          laptopId,
          savedAt: new Date(),
          note
        });
      }
      
      await userPrefs.save();
      
      res.json({
        success: true,
        message: `Laptop ${interactionType}d successfully`
      });
      
    } catch (error) {
      console.error('Track interaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track interaction'
      });
    }
  }
};

// Helper functions
function calculateMatchScore(laptop, preferences) {
  let score = 0;
  let totalWeight = 0;
  
  // Budget match (40% weight)
  const budgetScore = calculateBudgetScore(laptop.price.current, preferences.budget);
  score += budgetScore * 0.4;
  totalWeight += 0.4;
  
  // Performance match (30% weight)
  if (preferences.performance.importance >= 5) {
    const perfScore = calculatePerformanceScore(laptop, preferences);
    score += perfScore * 0.3;
    totalWeight += 0.3;
  }
  
  // Portability match (20% weight)
  if (preferences.portability.importance >= 5) {
    const portScore = calculatePortabilityScore(laptop, preferences);
    score += portScore * 0.2;
    totalWeight += 0.2;
  }
  
  // Display match (10% weight)
  if (preferences.display.importance >= 5) {
    const displayScore = calculateDisplayScore(laptop, preferences);
    score += displayScore * 0.1;
    totalWeight += 0.1;
  }
  
  return score / totalWeight;
}

function calculateBudgetScore(price, budgetPrefs) {
  if (price >= budgetPrefs.min && price <= budgetPrefs.max) {
    return 1;
  } else if (price < budgetPrefs.min) {
    return 0.8;
  } else if (price <= budgetPrefs.max * 1.2) {
    return 0.6;
  }
  return 0.3;
}

function calculatePerformanceScore(laptop, preferences) {
  // Simple scoring based on RAM and processor
  let score = 0;
  
  if (laptop.specifications.ram >= 16) score += 0.6;
  else if (laptop.specifications.ram >= 8) score += 0.4;
  else score += 0.2;
  
  if (laptop.specifications.processor.includes('i7') || laptop.specifications.processor.includes('Ryzen 7')) {
    score += 0.4;
  } else if (laptop.specifications.processor.includes('i5') || laptop.specifications.processor.includes('Ryzen 5')) {
    score += 0.3;
  } else {
    score += 0.2;
  }
  
  return score;
}

function calculatePortabilityScore(laptop, preferences) {
  const weight = laptop.specifications.weight;
  const maxWeight = preferences.portability.maxWeight;
  
  if (weight <= maxWeight) {
    return 1;
  } else if (weight <= maxWeight * 1.2) {
    return 0.7;
  } else if (weight <= maxWeight * 1.5) {
    return 0.4;
  }
  return 0.1;
}

function calculateDisplayScore(laptop, preferences) {
  let score = 0.5; // Base score
  
  if (preferences.display.touchscreen && laptop.features.touchscreen) {
    score += 0.3;
  }
  
  if (preferences.display.highRefreshRate && laptop.specifications.refreshRate >= 120) {
    score += 0.2;
  }
  
  return Math.min(score, 1);
}

function getRecommendationReasons(laptop, preferences) {
  const reasons = [];
  
  if (laptop.price.current >= preferences.budget.min && laptop.price.current <= preferences.budget.max) {
    reasons.push('Fits your budget range');
  }
  
  if (preferences.portability.importance >= 7 && laptop.specifications.weight <= preferences.portability.maxWeight) {
    reasons.push('Lightweight and portable');
  }
  
  if (preferences.performance.importance >= 7 && laptop.specifications.ram >= 16) {
    reasons.push('High performance for demanding tasks');
  }
  
  if (preferences.display.touchscreen && laptop.features.touchscreen) {
    reasons.push('Includes touchscreen as preferred');
  }
  
  return reasons;
}

module.exports = recommendationController;