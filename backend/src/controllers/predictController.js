const { spawn } = require('child_process');
const path = require('path');
const PredictionHistory = require('../models/PredictionHistory');
const Laptop = require('../models/Laptop');

const predictController = {
  predictPrice: async (req, res) => {
    try {
      const {
        ram,
        weight,
        company,
        typename,
        opsys,
        cpu,
        gpu,
        touchscreen,
        ips
      } = req.body;

      // Validate required fields
      if (!ram || !weight || !company || !typename || !opsys || !cpu || !gpu) {
        return res.status(400).json({
          error: 'Missing required fields'
        });
      }

      // Prepare data for Python script
      const inputData = {
        ram: parseInt(ram),
        weight: parseFloat(weight),
        company: company.toLowerCase(),
        typename: typename.toLowerCase(),
        opsys: opsys.toLowerCase(),
        cpu: cpu.toLowerCase(),
        gpu: gpu.toLowerCase(),
        touchscreen: touchscreen ? 1 : 0,
        ips: ips ? 1 : 0
      };

      // Call Python script
      const pythonProcess = spawn('python3', [
        path.join(__dirname, '../util/predict.py'),
        JSON.stringify(inputData)
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
          console.error('Python script error:', error);
          return res.status(500).json({
            error: 'Prediction failed',
            details: error
          });
        }

        try {
          const prediction = JSON.parse(result);
          
          // Generate session ID if not logged in
          const sessionId = req.user ? null : `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Save prediction history
          const history = await PredictionHistory.create({
            userId: req.user ? req.user.id : null,
            sessionId,
            inputData,
            predictionResult: {
              price_euros: prediction.price_euros,
              price_lkr: prediction.price_lkr
            }
          });
          
          // Find similar laptops based on prediction
          const similarLaptops = await Laptop.find({
            'price.current': {
              $gte: prediction.price_euros * 0.8,
              $lte: prediction.price_euros * 1.2
            },
            'specifications.ram': ram,
            brand: company
          }).limit(5);
          
          // Update history with recommendations
          history.recommendations = similarLaptops.map(laptop => ({
            laptopId: laptop._id,
            similarityScore: Math.random() * 0.5 + 0.5, // Mock score
            reason: 'Similar specifications and price range'
          }));
          await history.save();
          
          res.json({
            success: true,
            prediction: prediction.prediction,
            price_euros: prediction.price_euros,
            price_lkr: prediction.price_lkr,
            historyId: history._id,
            similarLaptops: similarLaptops.map(laptop => ({
              id: laptop._id,
              name: laptop.name,
              brand: laptop.brand,
              price: laptop.price.current,
              specifications: laptop.specifications
            }))
          });
          
        } catch (parseError) {
          console.error('Parse error:', parseError);
          res.status(500).json({
            error: 'Failed to parse prediction result'
          });
        }
      });

    } catch (error) {
      console.error('Prediction controller error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },
  
  // Get prediction history
  getPredictionHistory: async (req, res) => {
    try {
      const query = req.user ? { userId: req.user.id } : { sessionId: req.query.sessionId };
      
      if (!query.userId && !query.sessionId) {
        return res.status(400).json({
          success: false,
          error: 'User ID or session ID required'
        });
      }
      
      const history = await PredictionHistory.find(query)
        .sort({ createdAt: -1 })
        .populate('recommendations.laptopId', 'name brand price.current specifications');
      
      res.json({
        success: true,
        count: history.length,
        history
      });
      
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get prediction history'
      });
    }
  },
  
  // Submit feedback for prediction
  submitFeedback: async (req, res) => {
    try {
      const { historyId, accuracy, comment } = req.body;
      
      const history = await PredictionHistory.findById(historyId);
      if (!history) {
        return res.status(404).json({
          success: false,
          error: 'Prediction history not found'
        });
      }
      
      history.feedback = {
        accuracy,
        comment,
        submittedAt: new Date()
      };
      
      await history.save();
      
      res.json({
        success: true,
        message: 'Feedback submitted successfully'
      });
      
    } catch (error) {
      console.error('Submit feedback error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit feedback'
      });
    }
  }
};

module.exports = predictController;