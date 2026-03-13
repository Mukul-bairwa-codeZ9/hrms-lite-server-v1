const { body, validationResult } = require('express-validator');

const validateEmployee = [
  body('employeeId')
    .trim()
    .notEmpty().withMessage('Employee ID is required')
    .isLength({ min: 2, max: 20 }).withMessage('Employee ID must be 2–20 characters'),

  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  },
];

module.exports = { validateEmployee };