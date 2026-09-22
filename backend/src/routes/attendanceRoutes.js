import { Router } from 'express';
import {
  markAttendance,
  getStudentAttendance,
  exportSessionAttendanceCsv,
} from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateMarkAttendance } from '../validators/sessionValidator.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate);

router.post(
  '/mark',
  authorize(ROLES.STUDENT),
  validateRequest(validateMarkAttendance),
  markAttendance
);
router.get('/my-history', authorize(ROLES.STUDENT), getStudentAttendance);
router.get(
  '/session/:sessionId/export',
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  exportSessionAttendanceCsv
);

export default router;
