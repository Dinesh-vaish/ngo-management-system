'use strict';
const DonatedItem = require('../models/DonatedItem');

exports.donate = async (req, res, next) => {
  try {
    const { item_name, category, quantity, item_condition, pickup_required, notes } = req.body;
    const item = await DonatedItem.create({
      donor_id: req.user.id, item_name, category, quantity,
      item_condition, pickup_required, notes,
    });
    res.status(201).json({ success: true, message: 'Item donation recorded.', data: item });
  } catch (err) { next(err); }
};

exports.getMy = async (req, res, next) => {
  try {
    const items = await DonatedItem.find({ donor_id: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const items = await DonatedItem.find()
      .populate('donor_id','name email city')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed    = ['pending','received','distributed'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    await DonatedItem.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: `Item status updated to ${status}.` });
  } catch (err) { next(err); }
};
