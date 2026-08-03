'use strict';
const router   = require('express').Router();
const ctrl     = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');
const { uploadBanner }       = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management
 */

router.get('/',        ctrl.getAll);
router.get('/:id',     ctrl.getOne);
router.get('/:id/qr',  protect, ctrl.getQR);

router.post('/',    protect, authorize('admin'), uploadBanner, ctrl.create);
router.put('/:id',  protect, authorize('admin'), uploadBanner, ctrl.update);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteCampaign);
router.patch('/:id/status', protect, authorize('admin'), ctrl.setStatus);

module.exports = router;
