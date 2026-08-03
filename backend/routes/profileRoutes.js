'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { body }    = require('express-validator');
const validate    = require('../middleware/validate');

router.get('/',          protect, ctrl.getProfile);
router.put('/',          protect, ctrl.updateProfile);
router.put('/password',  protect, [
  body('current_password').notEmpty().withMessage('Current password required.'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  validate,
], ctrl.changePassword);

module.exports = router;
