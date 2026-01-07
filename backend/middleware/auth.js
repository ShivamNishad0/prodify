const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Remove 'Bearer ' from token if present
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Auth middleware: Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

