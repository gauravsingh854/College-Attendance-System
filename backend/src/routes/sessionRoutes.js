import { Router } from 'express';
import {
  createSession,
  getSessionQr,
  getTeacherSessions,
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateCreateSession } from '../validators/sessionValidator.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  validateRequest(validateCreateSession),
  createSession
);
router.get('/my-sessions', authorize(ROLES.TEACHER, ROLES.ADMIN), getTeacherSessions);
router.get('/:id/qr', authorize(ROLES.TEACHER, ROLES.ADMIN), getSessionQr);

export default router;
