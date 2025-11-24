import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // Fetch latest user record from DB to get authoritative is_admin flag
    const userFromDb = await User.findById(decoded.id);
    if (!userFromDb) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = { ...decoded, ...userFromDb };
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
