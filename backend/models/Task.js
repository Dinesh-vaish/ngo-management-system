'use strict';
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  campaign_id  : { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
  assigned_by  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_to  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title        : { type: String, required: true, trim: true },
  description  : { type: String },
  priority     : { type: String, enum: ['low','medium','high','urgent'], default: 'medium' },
  status       : { type: String, enum: ['open','accepted','in_progress','completed','cancelled'], default: 'open' },
  due_date     : { type: Date },
  completed_at : { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
