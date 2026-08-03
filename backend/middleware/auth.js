'use strict';
const jwt = require('jsonwebtoken');

/**
 * Verify JWT from Authorization header or cookie
 */
exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;          // { id, role, name, email }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

/**
 * Restrict route to specific roles
 * Usage: authorize('admin') or authorize('admin','donor')
 */
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not authorized for this action.`,
    });
  }
  next();
};
