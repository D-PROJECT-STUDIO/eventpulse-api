import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const createToken = user => jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email is already registered', 409));

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = createToken(user);

  res.status(201).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = createToken(user);
  res.json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});
