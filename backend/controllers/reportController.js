'use strict';
const Donation   = require('../models/Donation');
const Campaign   = require('../models/Campaign');
const User       = require('../models/User');
const Volunteer  = require('../models/Volunteer');
const pdfService = require('../services/pdfService');
const csvService = require('../services/csvService');

exports.donationReport = async (req, res, next) => {
  try {
    const { format = 'pdf', from, to } = req.query;
    const filter = {};
    if (from && to) filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    const raw = await Donation.find(filter)
      .populate('donor_id','name')
      .populate('campaign_id','title')
      .sort({ createdAt: -1 });
    const rows = raw.map(d => ({
      id            : d._id.toString(),
      donor         : d.donor_id?.name || '-',
      amount        : d.amount,
      payment_mode  : d.payment_mode,
      status        : d.status,
      receipt_number: d.receipt_number,
      campaign      : d.campaign_id?.title || 'General',
      date          : d.createdAt.toLocaleDateString('en-IN'),
    }));
    if (format === 'csv') return csvService.send(res, rows, 'donation_report');
    pdfService.generateReport(res, 'Donation Report', rows,
      ['id','donor','amount','payment_mode','status','receipt_number','campaign','date']);
  } catch (err) { next(err); }
};

exports.campaignReport = async (req, res, next) => {
  try {
    const { format = 'pdf' } = req.query;
    const raw = await Campaign.find().sort({ createdAt: -1 });
    const rows = raw.map(c => ({
      id              : c._id.toString(),
      title           : c.title,
      target_amount   : c.target_amount,
      collected_amount: c.collected_amount,
      status          : c.status,
      city            : c.city,
      start_date      : c.start_date?.toLocaleDateString('en-IN') || '-',
      end_date        : c.end_date?.toLocaleDateString('en-IN')   || '-',
    }));
    if (format === 'csv') return csvService.send(res, rows, 'campaign_report');
    pdfService.generateReport(res, 'Campaign Report', rows,
      ['id','title','target_amount','collected_amount','status','city','start_date','end_date']);
  } catch (err) { next(err); }
};

exports.volunteerReport = async (req, res, next) => {
  try {
    const { format = 'pdf' } = req.query;
    const users = await User.find({ role: 'volunteer' }).select('-password');
    const vols  = await Volunteer.find();
    const volMap = {};
    vols.forEach(v => { volMap[v.user_id.toString()] = v; });
    const rows = users.map(u => ({
      id        : u._id.toString(),
      name      : u.name,
      email     : u.email,
      city      : u.city,
      interests : volMap[u._id.toString()]?.interests || '-',
      tasks_done: volMap[u._id.toString()]?.tasks_done || 0,
      joined    : u.createdAt.toLocaleDateString('en-IN'),
    }));
    if (format === 'csv') return csvService.send(res, rows, 'volunteer_report');
    pdfService.generateReport(res, 'Volunteer Report', rows,
      ['id','name','email','city','interests','tasks_done','joined']);
  } catch (err) { next(err); }
};

exports.monthlyReport = async (req, res, next) => {
  try {
    const { month, format = 'pdf' } = req.query;
    const ym    = month || new Date().toISOString().slice(0, 7);
    const start = new Date(`${ym}-01`);
    const end   = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
    const raw = await Donation.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: {
        _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, status: '$status' },
        total_donations: { $sum: 1 },
        total_amount   : { $sum: '$amount' },
      }},
      { $sort: { '_id.date': 1 } },
    ]);
    const rows = raw.map(r => ({
      date            : r._id.date,
      status          : r._id.status,
      total_donations : r.total_donations,
      total_amount    : r.total_amount,
    }));
    if (format === 'csv') return csvService.send(res, rows, `monthly_report_${ym}`);
    pdfService.generateReport(res, `Monthly Report — ${ym}`, rows,
      ['date','status','total_donations','total_amount']);
  } catch (err) { next(err); }
};
