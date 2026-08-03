'use strict';
const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');
const User        = require('../models/User');
const Donor       = require('../models/Donor');
const Volunteer   = require('../models/Volunteer');
const Admin       = require('../models/Admin');
const Notify      = require('../services/notificationService');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure  : process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge  : 7 * 24 * 60 * 60 * 1000,
  };
}

/** POST /api/auth/register/donor */
exports.registerDonor = async (req, res, next) => {
  try {
    const { name, email, password, phone, city, address } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const user = await User.create({ name, email, password: hash, phone, role: 'donor', city });
    await Donor.create({ user_id: user._id, address: address || '' });
    await Notify.create(user._id, 'welcome', 'Welcome to Manara-Nexus!', `Hello ${name}, your donor account has been created.`);

    const token = signToken(user);
    res.cookie('token', token, cookieOptions());
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ success: true, message: 'Donor registered successfully.', token, user: safeUser });
  } catch (err) { next(err); }
};

/** POST /api/auth/register/volunteer */
exports.registerVolunteer = async (req, res, next) => {
  try {
    const { name, email, password, phone, city, interests, dob } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const user = await User.create({ name, email, password: hash, phone, role: 'volunteer', city });
    await Volunteer.create({ user_id: user._id, interests: interests || '', dob: dob || null });
    await Notify.create(user._id, 'welcome', 'Welcome to Manara-Nexus!', `Hello ${name}, your volunteer account has been created.`);

    const token = signToken(user);
    res.cookie('token', token, cookieOptions());
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ success: true, message: 'Volunteer registered successfully.', token, user: safeUser });
  } catch (err) { next(err); }
};

/** POST /api/auth/register/admin  — existing admin token required */
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, city } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const user = await User.create({ name, email, password: hash, phone, role: 'admin', city });
    const username = email.split('@')[0] + '_' + Date.now();
    await Admin.create({ user_id: user._id, username });

    const token = signToken(user);
    res.cookie('token', token, cookieOptions());
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ success: true, message: 'Admin registered successfully.', token, user: safeUser });
  } catch (err) { next(err); }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    if (!user.is_active) return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = signToken(user);
    res.cookie('token', token, cookieOptions());
    const { password: _, ...safeUser } = user.toObject();
    res.json({ success: true, message: 'Login successful.', token, user: safeUser });
  } catch (err) { next(err); }
};

/** POST /api/auth/logout */
exports.logout = (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

/** GET /api/auth/me */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};
