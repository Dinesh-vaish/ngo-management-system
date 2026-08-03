'use strict';
const ContactMessage = require('../models/ContactMessage');

exports.send = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent. We will get back to you soon.' });
  } catch (err) { next(err); }
};
