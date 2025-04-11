const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  const token = authHeader.replace('Bearer ', ''); // Extract the token
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for the secret
    const decoded = jwt.verify(token, jwtSecret); // Verify the token
    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT verification error:', err.message); // Log the error for debugging
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;