'use strict';
const Campaign = require('../models/Campaign');
const QRCode   = require('qrcode');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const campaigns = await Campaign.find(filter)
      .populate('admin_id', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('admin_id', 'name email');
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, data: campaign });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const banner_image = req.file ? `/uploads/banners/${req.file.filename}` : null;
    const campaign = await Campaign.create({
      ...req.body,
      admin_id: req.user.id,
      banner_image,
    });
    res.status(201).json({ success: true, message: 'Campaign created.', data: campaign });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.banner_image = `/uploads/banners/${req.file.filename}`;
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, message: 'Campaign updated.', data: campaign });
  } catch (err) { next(err); }
};

exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, message: 'Campaign deleted.' });
  } catch (err) { next(err); }
};

exports.setStatus = async (req, res, next) => {
  try {
    const allowed = ['active','inactive','completed','cancelled'];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    await Campaign.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true, message: `Campaign status set to ${req.body.status}.` });
  } catch (err) { next(err); }
};

exports.getQR = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    const paymentUrl = `${process.env.FRONTEND_URL}/frontend/donor/donateMoney.html?campaign=${campaign._id}`;
    const qr = await QRCode.toDataURL(paymentUrl, { width: 300, margin: 2 });
    res.json({ success: true, campaign_id: campaign._id, qr_code: qr, payment_url: paymentUrl });
  } catch (err) { next(err); }
};
