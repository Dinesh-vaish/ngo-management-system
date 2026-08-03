'use strict';
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user_id  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username : { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
