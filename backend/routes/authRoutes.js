'use strict';
const router   = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const passwordRules = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.');
const emailRules    = body('email').isEmail().normalizeEmail().withMessage('Valid email is required.');
const commonRules   = [
  body('name').notEmpty().withMessage('Name is required.'),
  emailRules,
  passwordRules,
  body('phone').isMobilePhone().withMessage('Valid phone number required.'),
  body('city').isIn(['Bengaluru','Hyderabad','Chennai','Mumbai']).withMessage('Invalid city.'),
  validate,
];

// Register
router.post('/register/admin',     commonRules, ctrl.registerAdmin);
router.post('/register/donor',     commonRules, ctrl.registerDonor);
router.post('/register/volunteer', commonRules, ctrl.registerVolunteer);

// Login / Logout / Me
router.post('/login',  [emailRules, body('password').notEmpty(), validate], ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.get('/me',      protect, ctrl.getMe);

module.exports = router;
