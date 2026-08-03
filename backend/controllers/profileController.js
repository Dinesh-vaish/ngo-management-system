'use strict';
const bcrypt    = require('bcryptjs');
const User      = require('../models/User');
const Donor     = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Admin     = require('../models/Admin');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let extra  = {};
    if (req.user.role === 'donor')     extra = await Donor.findOne({ user_id: req.user.id }) || {};
    if (req.user.role === 'volunteer') extra = await Volunteer.findOne({ user_id: req.user.id }) || {};
    if (req.user.role === 'admin')     extra = await Admin.findOne({ user_id: req.user.id }) || {};
    res.json({ success: true, data: { ...user.toObject(), profile: extra } });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, address, interests, dob, bank_name, ifsc_code, account_number } = req.body;
    const userUpdates = {};
    if (name)  userUpdates.name  = name;
    if (phone) userUpdates.phone = phone;
    if (city)  userUpdates.city  = city;
    await User.findByIdAndUpdate(req.user.id, userUpdates);

    if (req.user.role === 'donor') {
      await Donor.findOneAndUpdate({ user_id: req.user.id },
        { address, bank_name, ifsc_code, account_number }, { upsert: true });
    }
    if (req.user.role === 'volunteer') {
      await Volunteer.findOneAndUpdate({ user_id: req.user.id },
        { interests, dob }, { upsert: true });
    }
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user  = await User.findById(req.user.id);
    const match = await bcrypt.compare(current_password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    const hash = await bcrypt.hash(new_password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    await User.findByIdAndUpdate(req.user.id, { password: hash });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) { next(err); }
};
