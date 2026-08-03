'use strict';
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const donationSchema = new mongoose.Schema({
  donor_id            : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaign_id         : { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
  amount              : { type: Number, required: true },
  payment_mode        : { type: String, enum: ['cash','upi','bank_transfer','cheque','online'], required: true },
  status              : { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  receipt_number      : { type: String, unique: true },
  transaction_ref     : { type: String },
  razorpay_order_id   : { type: String },
  razorpay_payment_id : { type: String },
  razorpay_signature  : { type: String },
  verified_by         : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  verified_at         : { type: Date },
  notes               : { type: String },
}, { timestamps: true });

// Auto-generate receipt number before save
donationSchema.pre('save', function(next) {
  if (!this.receipt_number) {
    const now = new Date();
    this.receipt_number = `MN-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${uuidv4().slice(0,8).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
