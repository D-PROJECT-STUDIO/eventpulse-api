import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();
router.get('/', (req, res) => res.json({
  status: 'ok',
  environment: process.env.NODE_ENV || 'development',
  uptime: Math.floor(process.uptime()),
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

export default router;
