'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/itemController');
const { protect, authorize } = require('../middleware/auth');

router.post('/',              protect, authorize('donor'), ctrl.donate);
router.get('/my',             protect, authorize('donor'), ctrl.getMy);
router.get('/',               protect, authorize('admin'), ctrl.getAll);
router.patch('/:id/status',   protect, authorize('admin'), ctrl.updateStatus);

module.exports = router;
