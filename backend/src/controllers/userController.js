const User = require('../models/User');
const UserPreference = require('../models/UserPreference');
const PredictionHistory = require('../models/PredictionHistory');

const userController = {
  // Get user dashboard data
  getDashboard: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get user data
      const user = await User.findById(userId);
      const preferences = await UserPreference.findOne({ userId });
      
      // Get recent predictions
      const recentPredictions = await PredictionHistory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('recommendations.laptopId', 'name brand');
      
      // Get saved laptops
      const savedLaptops = preferences ? await Promise.all(
        preferences.savedLaptops.slice(0, 5).map(async (saved) => {
          const laptop = await require('../models/Laptop').findById(saved.laptopId)
            .select('name brand price.current specifications images');
          return {
            ...saved.toObject(),
            laptop
          };
        })
      ) : [];
      
      // Statistics
      const stats = {
        totalPredictions: await PredictionHistory.countDocuments({ userId }),
        savedLaptops: preferences ? preferences.savedLaptops.length : 0,
        viewedLaptops: preferences ? preferences.viewedLaptops.length : 0
      };
      
      res.json({
        success: true,
        user,
        preferences,
        recentPredictions,
        savedLaptops,
        stats
      });
      
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load dashboard'
      });
    }
  },
  
  // Update user settings
  updateSettings: async (req, res) => {
    try {
      const { notifications, theme, language } = req.body;
      
      // In a real app, you'd have a UserSettings model
      // For now, we'll update user preferences
      const userPrefs = await UserPreference.findOneAndUpdate(
        { userId: req.user.id },
        { 
          $set: {
            'settings.notifications': notifications,
            'settings.theme': theme,
            'settings.language': language
          }
        },
        { new: true, upsert: true }
      );
      
      res.json({
        success: true,
        settings: userPrefs.settings
      });
      
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update settings'
      });
    }
  },
  
  // Get user activity
  getActivity: async (req, res) => {
    try {
      const { limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      const activities = [];
      
      // Get predictions
      const predictions = await PredictionHistory.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit / 2)
        .populate('recommendations.laptopId', 'name brand');
      
      predictions.forEach(pred => {
        activities.push({
          type: 'prediction',
          date: pred.createdAt,
          data: {
            predictedPrice: pred.predictionResult.price_euros,
            inputSpecs: pred.inputData
          }
        });
      });
      
      // Get viewed laptops (from preferences)
      const preferences = await UserPreference.findOne({ userId: req.user.id });
      if (preferences && preferences.viewedLaptops.length > 0) {
        const recentViews = preferences.viewedLaptops
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, limit / 2);
        
        for (const view of recentViews) {
          const laptop = await require('../models/Laptop').findById(view.laptopId)
            .select('name brand price.current');
          
          if (laptop) {
            activities.push({
              type: 'view',
              date: view.viewedAt,
              data: {
                laptopName: laptop.name,
                brand: laptop.brand,
                price: laptop.price.current
              }
            });
          }
        }
      }
      
      // Sort all activities by date
      activities.sort((a, b) => b.date - a.date);
      
      res.json({
        success: true,
        activities: activities.slice(0, limit),
        total: await PredictionHistory.countDocuments({ userId: req.user.id }) + 
               (preferences ? preferences.viewedLaptops.length : 0)
      });
      
    } catch (error) {
      console.error('Get activity error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get activity'
      });
    }
  },
  
  // Export user data
  exportData: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Collect all user data
      const user = await User.findById(userId).select('-password');
      const preferences = await UserPreference.findOne({ userId });
      const predictions = await PredictionHistory.find({ userId });
      
      const exportData = {
        userInfo: user,
        preferences: preferences,
        predictionHistory: predictions,
        exportedAt: new Date().toISOString()
      };
      
      // Set headers for download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="user_data_${userId}_${Date.now()}.json"`);
      
      res.send(JSON.stringify(exportData, null, 2));
      
    } catch (error) {
      console.error('Export data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export data'
      });
    }
  },
  
  // Delete account
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Delete all user data
      await Promise.all([
        User.findByIdAndDelete(userId),
        UserPreference.findOneAndDelete({ userId }),
        PredictionHistory.deleteMany({ userId })
      ]);
      
      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
      
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete account'
      });
    }
  }
};

module.exports = userController;