const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/database.js');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const predictRoutes = require('./src/routes/predictRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const laptopRoutes = require('./src/routes/laptopRoutes'); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laptops', laptopRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});