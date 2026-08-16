import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createAnnouncement,
  getAnnouncements
} from '../controllers/announcementController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.post('/', requireAuth, requireRole('admin'), [
  body('eventId').isMongoId().withMessage('Event id must be valid'),
  body('text').trim().notEmpty().withMessage('Announcement text is required')
], validate, createAnnouncement);

router.get('/:eventId',
  param('eventId').isMongoId().withMessage('Event id must be valid'),
  validate,
  getAnnouncements
);

export default router;
