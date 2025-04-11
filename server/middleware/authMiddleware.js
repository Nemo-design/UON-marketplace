const jwt = require('jsonwebtoken');

const authMiddleware = (required = true) => (req, res, next) => {
  const authHeader = req.header('Authorization');

  // If authentication is not required and no token provided, proceed
  if (!required && !authHeader) {
    req.user = null;
    return next();
  }

  // Check token format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  const token = authHeader.replace('Bearer ', ''); // Extract the token

  try {
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach the decoded payload to the request object
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    
    // If authentication is not required, proceed even with invalid token
    if (!required) {
      req.user = null;
      return next();
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;  