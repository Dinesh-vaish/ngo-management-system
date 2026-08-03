'use strict';
const mongoose = require('mongoose');

const donatedItemSchema = new mongoose.Schema({
  donor_id       : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item_name      : { type: String, required: true, trim: true },
  category       : { type: String },
  quantity       : { type: Number, default: 1 },
  item_condition : { type: String, enum: ['new','good','fair','poor'], default: 'good' },
  pickup_required: { type: Boolean, default: false },
  status         : { type: String, enum: ['pending','received','distributed'], default: 'pending' },
  notes          : { type: String },
}, { timestamps: true });

module.exports = mongoose.model('DonatedItem', donatedItemSchema);
