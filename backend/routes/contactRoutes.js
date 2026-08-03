'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/contactController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/', [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('message').notEmpty().withMessage('Message is required.'),
  validate,
], ctrl.send);

module.exports = router;
