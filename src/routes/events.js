import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent
} from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const eventRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('Category must be a valid id'),
  body('date').isISO8601().withMessage('Date must be valid'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number')
];

const updateRules = [
  param('id').isMongoId().withMessage('Event id must be valid'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isMongoId().withMessage('Category must be a valid id'),
  body('date').optional().isISO8601().withMessage('Date must be valid'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('venue').optional().trim().notEmpty().withMessage('Venue cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive number')
];

router.get('/', getEvents);
router.get('/:id', param('id').isMongoId().withMessage('Event id must be valid'), validate, getEvent);
router.post('/', requireAuth, requireRole('admin'), eventRules, validate, createEvent);
router.patch('/:id', requireAuth, requireRole('admin'), updateRules, validate, updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), param('id').isMongoId().withMessage('Event id must be valid'), validate, deleteEvent);

export default router;
