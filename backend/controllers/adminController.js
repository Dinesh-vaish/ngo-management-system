'use strict';
const User        = require('../models/User');
const Donor       = require('../models/Donor');
const Volunteer   = require('../models/Volunteer');
const Donation    = require('../models/Donation');
const Campaign    = require('../models/Campaign');
const Task        = require('../models/Task');
const Transaction = require('../models/Transaction');
const ContactMessage = require('../models/ContactMessage');

/** GET /api/admin/dashboard */
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalDonors, totalVolunteers, activeCampaigns,
      completedTasks, pendingDonations, unreadMessages,
      donationAgg
    ] = await Promise.all([
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'volunteer' }),
      Campaign.countDocuments({ status: 'active' }),
      Task.countDocuments({ status: 'completed' }),
      Donation.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ is_read: false }),
      Donation.aggregate([
        { $match: { status: 'verified' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total_donors     : totalDonors,
        total_volunteers : totalVolunteers,
        active_campaigns : activeCampaigns,
        completed_tasks  : completedTasks,
        pending_donations: pendingDonations,
        unread_messages  : unreadMessages,
        total_donations  : donationAgg[0]?.count  || 0,
        total_amount     : donationAgg[0]?.total   || 0,
      }
    });
  } catch (err) { next(err); }
};

/** GET /api/admin/donors?city=Bengaluru */
exports.getDonors = async (req, res, next) => {
  try {
    const filter = { role: 'donor' };
    if (req.query.city) filter.city = req.query.city;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    const ids   = users.map(u => u._id);
    const donors = await Donor.find({ user_id: { $in: ids } });
    const donorMap = {};
    donors.forEach(d => { donorMap[d.user_id.toString()] = d; });
    const data = users.map(u => ({
      ...u.toObject(),
      donor_details: donorMap[u._id.toString()] || {}
    }));
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

/** GET /api/admin/volunteers */
exports.getVolunteers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'volunteer' }).select('-password').sort({ createdAt: -1 });
    const ids   = users.map(u => u._id);
    const vols  = await Volunteer.find({ user_id: { $in: ids } });
    const volMap = {};
    vols.forEach(v => { volMap[v.user_id.toString()] = v; });
    const data = users.map(u => ({
      ...u.toObject(),
      volunteer_details: volMap[u._id.toString()] || {}
    }));
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

/** DELETE /api/admin/users/:id */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) { next(err); }
};

/** PATCH /api/admin/users/:id/deactivate */
exports.deactivateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: 'User deactivated.' });
  } catch (err) { next(err); }
};

/** GET /api/admin/transactions */
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('donor_id', 'name email city')
      .populate('donation_id', 'receipt_number payment_mode amount')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) { next(err); }
};

/** GET /api/admin/messages */
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) { next(err); }
};

/** PATCH /api/admin/messages/:id/read */
exports.markMessageRead = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ success: true, message: 'Message marked as read.' });
  } catch (err) { next(err); }
};
