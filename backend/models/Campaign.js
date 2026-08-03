'use strict';
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  admin_id         : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title            : { type: String, required: true, trim: true },
  description      : { type: String, required: true },
  target_amount    : { type: Number, required: true, default: 0 },
  collected_amount : { type: Number, default: 0 },
  start_date       : { type: Date, required: true },
  end_date         : { type: Date, required: true },
  status           : { type: String, enum: ['active','inactive','completed','cancelled'], default: 'active' },
  banner_image     : { type: String },
  city             : { type: String, enum: ['Bengaluru','Hyderabad','Chennai','Mumbai','All'], default: 'All' },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
