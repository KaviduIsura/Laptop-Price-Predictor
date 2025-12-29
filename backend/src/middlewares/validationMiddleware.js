const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

// Validation rules
const authValidation = {
  register: validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]),
  
  login: validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ])
};

const predictValidation = {
  predict: validate([
    body('ram').isInt({ min: 2, max: 128 }).withMessage('RAM must be between 2 and 128 GB'),
    body('weight').isFloat({ min: 0.5, max: 5 }).withMessage('Weight must be between 0.5 and 5 kg'),
    body('company').isIn(['acer', 'apple', 'asus', 'dell', 'hp', 'lenovo', 'msi', 'other', 'toshiba']),
    body('typename').isIn(['2in1convertible', 'gaming', 'netbook', 'notebook', 'ultrabook', 'workstation']),
    body('opsys').isIn(['linux', 'mac', 'other', 'windows']),
    body('cpu').isIn(['amd', 'intelcorei3', 'intelcorei5', 'intelcorei7', 'other']),
    body('gpu').isIn(['amd', 'intel', 'nvidia'])
  ])
};

module.exports = {
  validate,
  authValidation,
  predictValidation
};