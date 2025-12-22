const { spawn } = require('child_process');
const path = require('path');

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

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', error);
          return res.status(500).json({
            error: 'Prediction failed',
            details: error
          });
        }

        try {
          const prediction = JSON.parse(result);
          res.json({
            success: true,
            prediction: prediction.prediction,
            price_euros: prediction.price_euros,
            price_pkr: prediction.price_pkr
          });
        } catch (parseError) {
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
  }
};

module.exports = predictController;