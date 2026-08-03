'use strict';
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  donation_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  donor_id    : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount      : { type: Number, required: true },
  type        : { type: String, enum: ['credit','debit'], default: 'credit' },
  description : { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
