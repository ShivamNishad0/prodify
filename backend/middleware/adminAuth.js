const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    console.log('AdminAuth middleware: No token provided');
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
      console.log('AdminAuth middleware: User not found from token');
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('AdminAuth middleware: Non-admin user attempted access');
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log('AdminAuth middleware: Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

