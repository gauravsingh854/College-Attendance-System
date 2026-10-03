import { Router } from 'express';
import {
  startSession,
  getSessionQr,
  getSessionLive,
  endSession,
  getTeacherSessions
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate);

// Teacher session endpoints
router.post('/start', authorize(ROLES.TEACHER), startSession);
router.get('/:sessionId/qr', authorize(ROLES.TEACHER), getSessionQr);
router.get('/:sessionId/live', authorize(ROLES.TEACHER), getSessionLive);
router.post('/:sessionId/end', authorize(ROLES.TEACHER), endSession);

// Get all sessions for a teacher (useful for history)
router.get('/my-sessions', authorize(ROLES.TEACHER), getTeacherSessions);

export default router;
