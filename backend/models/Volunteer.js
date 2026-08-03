'use strict';
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user_id    : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  interests  : { type: String },
  dob        : { type: Date },
  tasks_done : { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
