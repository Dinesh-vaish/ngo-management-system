'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: Donation management & Razorpay payment
 */

// Donor routes
router.post('/',                    protect, authorize('donor'), ctrl.create);
router.post('/razorpay/order',      protect, authorize('donor'), ctrl.createRazorpayOrder);
router.post('/razorpay/verify',     protect, authorize('donor'), ctrl.verifyRazorpay);
router.get('/my',                   protect, authorize('donor'), ctrl.getMy);
router.get('/:id/receipt',          protect, ctrl.downloadReceipt);

// Admin routes
router.get('/',                     protect, authorize('admin'), ctrl.getAll);
router.patch('/:id/verify',         protect, authorize('admin'), ctrl.verify);
router.patch('/:id/reject',         protect, authorize('admin'), ctrl.reject);

module.exports = router;
