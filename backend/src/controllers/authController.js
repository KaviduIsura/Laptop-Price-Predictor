const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserPreference = require('../models/UserPreference');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

const authController = {
  // Register user
  register: async (req, res) => {
    try {
      const { name, email, password, budgetRange, usageType } = req.body;
      
      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }
      
      // Create user
      const user = await User.create({
        name,
        email,
        password,
        budgetRange,
        usageType
      });
      
      // Create user preferences
      await UserPreference.create({
        userId: user._id,
        preferences: {
          budget: budgetRange || { min: 0, max: 5000, currency: 'EUR' }
        }
      });
      
      // Generate token
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  },
  
  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check for user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Generate token
      const token = generateToken(user._id);
      
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  },
  
  // Get current user
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const preferences = await UserPreference.findOne({ userId: req.user.id });
      
      res.json({
        success: true,
        user,
        preferences
      });
      
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user data'
      });
    }
  },
  
  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, budgetRange, usageType } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { 
          name, 
          budgetRange, 
          usageType,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        user
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  },
  
  // Update user preferences
  updatePreferences: async (req, res) => {
    try {
      const { preferences } = req.body;
      
      const userPrefs = await UserPreference.findOneAndUpdate(
        { userId: req.user.id },
        { preferences, lastUpdated: Date.now() },
        { new: true, upsert: true }
      );
      
      res.json({
        success: true,
        preferences: userPrefs
      });
      
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update preferences'
      });
    }
  }
};

module.exports = authController;