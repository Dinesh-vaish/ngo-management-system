'use strict';
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  user_id        : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  address        : { type: String },
  bank_name      : { type: String },
  ifsc_code      : { type: String },
  account_number : { type: String },
  total_donated  : { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
