const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify token and user role
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check admin privileges
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access restricted to Admins only' });
  }
  next();
};

// Middleware to check representative privileges
const authorizeRepresentative = (req, res, next) => {
  if (req.user.role !== 'Representative') {
    return res.status(403).json({ message: 'Access restricted to Representatives only' });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin, authorizeRepresentative };
