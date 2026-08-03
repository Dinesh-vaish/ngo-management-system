'use strict';
const Razorpay    = require('razorpay');
const crypto      = require('crypto');
const Donation    = require('../models/Donation');
const Campaign    = require('../models/Campaign');
const Donor       = require('../models/Donor');
const Transaction = require('../models/Transaction');
const Notify      = require('../services/notificationService');
const pdfService  = require('../services/pdfService');

// Lazy init — only instantiate when keys are present
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('XXXX')) {
    throw new Error('Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
  return new Razorpay({
    key_id    : process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/** POST /api/donations  — offline (cash/upi/bank) */
exports.create = async (req, res, next) => {
  try {
    const { campaign_id, amount, payment_mode, transaction_ref, notes } = req.body;
    const donation = await Donation.create({
      donor_id: req.user.id, campaign_id: campaign_id || null,
      amount, payment_mode, transaction_ref: transaction_ref || null, notes: notes || null,
    });
    if (campaign_id) await Campaign.findByIdAndUpdate(campaign_id, { $inc: { collected_amount: amount } });
    await Donor.findOneAndUpdate({ user_id: req.user.id }, { $inc: { total_donated: amount } });
    await Transaction.create({ donation_id: donation._id, donor_id: req.user.id, amount, description: `Donation via ${payment_mode}` });
    await Notify.create(req.user.id, 'donation_success', 'Donation Received', `Your donation of ₹${amount} (Receipt: ${donation.receipt_number}) is pending verification.`);
    res.status(201).json({ success: true, message: 'Donation recorded.', donation_id: donation._id, receipt_number: donation.receipt_number });
  } catch (err) { next(err); }
};

/** POST /api/donations/razorpay/order */
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const razorpay = getRazorpay();
    const { amount, campaign_id, notes } = req.body;
    const amountPaise = Math.round(parseFloat(amount) * 100);
    const order = await razorpay.orders.create({
      amount: amountPaise, currency: 'INR',
      notes : { campaign_id: campaign_id || '', donor_id: req.user.id.toString() },
    });
    const donation = await Donation.create({
      donor_id: req.user.id, campaign_id: campaign_id || null,
      amount, payment_mode: 'online', razorpay_order_id: order.id, notes: notes || null,
    });
    res.json({
      success: true, order_id: order.id, amount: amountPaise, currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
      donation_id: donation._id, receipt: donation.receipt_number,
    });
  } catch (err) { next(err); }
};

/** POST /api/donations/razorpay/verify */
exports.verifyRazorpay = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donation_id, campaign_id, amount } = req.body;
    const body     = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expected !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });

    const donation = await Donation.findByIdAndUpdate(donation_id, {
      razorpay_payment_id, razorpay_signature,
      status: 'verified', verified_at: new Date(),
    }, { new: true });

    if (campaign_id) await Campaign.findByIdAndUpdate(campaign_id, { $inc: { collected_amount: amount } });
    await Donor.findOneAndUpdate({ user_id: req.user.id }, { $inc: { total_donated: amount } });
    await Transaction.create({ donation_id: donation._id, donor_id: req.user.id, amount, description: 'Online payment via Razorpay' });
    await Notify.create(req.user.id, 'donation_success', 'Payment Successful', `Your payment of ₹${amount} was successful. Receipt: ${donation.receipt_number}`);
    res.json({ success: true, message: 'Payment verified.', donation });
  } catch (err) { next(err); }
};

/** GET /api/donations  — admin */
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status)      filter.status      = req.query.status;
    if (req.query.campaign_id) filter.campaign_id = req.query.campaign_id;
    const donations = await Donation.find(filter)
      .populate('donor_id',   'name email city')
      .populate('campaign_id','title')
      .populate('verified_by','name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (err) { next(err); }
};

/** GET /api/donations/my  — donor */
exports.getMy = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor_id: req.user.id })
      .populate('campaign_id','title')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (err) { next(err); }
};

/** PATCH /api/donations/:id/verify */
exports.verify = async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id,
      { status: 'verified', verified_by: req.user.id, verified_at: new Date() },
      { new: true }
    ).populate('donor_id','name email');
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    await Notify.create(donation.donor_id._id, 'donation_approved', 'Donation Approved', `Your donation of ₹${donation.amount} has been verified. Receipt: ${donation.receipt_number}`);
    res.json({ success: true, message: 'Donation verified.' });
  } catch (err) { next(err); }
};

/** PATCH /api/donations/:id/reject */
exports.reject = async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id,
      { status: 'rejected', verified_by: req.user.id },
      { new: true }
    );
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    res.json({ success: true, message: 'Donation rejected.' });
  } catch (err) { next(err); }
};

/** GET /api/donations/:id/receipt  — PDF */
exports.downloadReceipt = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor_id',   'name email')
      .populate('campaign_id','title');
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });
    if (req.user.role === 'donor' && donation.donor_id._id.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    pdfService.generateReceipt(donation, res);
  } catch (err) { next(err); }
};
