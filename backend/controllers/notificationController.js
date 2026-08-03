'use strict';
const Notification = require('../models/Notification');

exports.getAll = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
      .sort({ createdAt: -1 }).limit(50);
    const unread = notifications.filter(n => !n.is_read).length;
    res.json({ success: true, unread, data: notifications });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { is_read: true }
    );
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) { next(err); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user_id: req.user.id }, { is_read: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) { next(err); }
};
