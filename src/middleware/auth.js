import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next(new AppError('Authentication required', 401));

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('name email role');
    if (!user) return next(new AppError('Authentication required', 401));
    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
});

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403));
  next();
};
