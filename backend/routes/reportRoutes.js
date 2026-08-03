'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const admin = [protect, authorize('admin')];

router.get('/donations',  ...admin, ctrl.donationReport);
router.get('/campaigns',  ...admin, ctrl.campaignReport);
router.get('/volunteers', ...admin, ctrl.volunteerReport);
router.get('/monthly',    ...admin, ctrl.monthlyReport);

module.exports = router;
