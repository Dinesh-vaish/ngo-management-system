'use strict';
const Task      = require('../models/Task');
const Volunteer = require('../models/Volunteer');
const Notify    = require('../services/notificationService');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'volunteer') filter.assigned_to = req.user.id;
    else if (req.query.status)         filter.status = req.query.status;
    const tasks = await Task.find(filter)
      .populate('assigned_by','name')
      .populate('assigned_to','name email')
      .populate('campaign_id','title')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assigned_by','name')
      .populate('assigned_to','name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, assigned_by: req.user.id });
    if (task.assigned_to) {
      await Notify.create(task.assigned_to, 'task_assigned', 'New Task Assigned',
        `You have been assigned: "${task.title}". Due: ${task.due_date ? task.due_date.toDateString() : 'N/A'}`);
    }
    res.status(201).json({ success: true, message: 'Task created.', data: task });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, message: 'Task updated.', data: task });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed    = ['accepted','in_progress','completed','cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (req.user.role === 'volunteer' && task.assigned_to?.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not your task.' });

    const updates = { status };
    if (status === 'completed') updates.completed_at = new Date();
    await Task.findByIdAndUpdate(req.params.id, updates);

    if (status === 'completed')
      await Volunteer.findOneAndUpdate({ user_id: req.user.id }, { $inc: { tasks_done: 1 } });

    res.json({ success: true, message: `Task marked as ${status}.` });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) { next(err); }
};
