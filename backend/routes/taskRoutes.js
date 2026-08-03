'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management for volunteers
 */

router.get('/',          protect, ctrl.getAll);
router.get('/:id',       protect, ctrl.getOne);
router.post('/',         protect, authorize('admin'), ctrl.create);
router.put('/:id',       protect, authorize('admin'), ctrl.update);
router.delete('/:id',    protect, authorize('admin'), ctrl.deleteTask);
router.patch('/:id/status', protect, authorize('admin','volunteer'), ctrl.updateStatus);

module.exports = router;
