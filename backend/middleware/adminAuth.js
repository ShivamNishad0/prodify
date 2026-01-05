const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token and get user
  try {
    // Remove 'Bearer ' from token if present
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Get full user data including role
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Admin auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

