'use strict';
const Notification = require('../models/Notification');

exports.create = async (userId, type, title, message, ref = {}) => {
  try {
    await Notification.create({
      user_id : userId,
      type, title, message,
      ref_id  : ref.ref_id   || null,
      ref_type: ref.ref_type || null,
    });
    // Future: await emailAdapter.send(userId, title, message);
    // Future: await smsAdapter.send(userId, message);
  } catch (err) {
    console.error('[Notification] Failed:', err.message);
  }
};
