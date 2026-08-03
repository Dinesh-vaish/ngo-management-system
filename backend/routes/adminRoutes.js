'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const admin = [protect, authorize('admin')];

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

router.get('/dashboard',              ...admin, ctrl.getDashboard);
router.get('/donors',                 ...admin, ctrl.getDonors);
router.get('/volunteers',             ...admin, ctrl.getVolunteers);
router.get('/transactions',           ...admin, ctrl.getTransactions);
router.get('/messages',               ...admin, ctrl.getMessages);
router.patch('/messages/:id/read',    ...admin, ctrl.markMessageRead);
router.delete('/users/:id',           ...admin, ctrl.deleteUser);
router.patch('/users/:id/deactivate', ...admin, ctrl.deactivateUser);

module.exports = router;
