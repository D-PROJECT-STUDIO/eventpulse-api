import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  cancelRegistration,
  getMyRegistrations,
  registerForEvent
} from '../controllers/registrationController.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.post('/', requireAuth,
  body('eventId').isMongoId().withMessage('Event id must be valid'),
  validate,
  registerForEvent
);
router.get('/my', requireAuth, getMyRegistrations);
router.delete('/:id', requireAuth,
  param('id').isMongoId().withMessage('Registration id must be valid'),
  validate,
  cancelRegistration
);

export default router;
