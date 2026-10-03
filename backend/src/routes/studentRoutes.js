import { Router } from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  enrollFace,
  getDashboardData,
  getAttendanceHistory,
  createCorrectionRequest,
  getCorrectionRequests,
  getNotifications,
  markNotificationRead
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  validateStudentProfile,
  validateFaceEnrollment,
} from '../validators/studentValidator.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate);

router.get('/profile', authorize(ROLES.STUDENT), getStudentProfile);
router.put(
  '/profile',
  authorize(ROLES.STUDENT),
  validateRequest(validateStudentProfile),
  updateStudentProfile
);
router.post(
  '/face-enroll',
  authorize(ROLES.STUDENT),
  validateRequest(validateFaceEnrollment),
  enrollFace
);

router.get('/dashboard', authorize(ROLES.STUDENT), getDashboardData);
router.get('/attendance/history', authorize(ROLES.STUDENT), getAttendanceHistory);

router.post('/correction', authorize(ROLES.STUDENT), createCorrectionRequest);
router.get('/correction', authorize(ROLES.STUDENT), getCorrectionRequests);

router.get('/notifications', authorize(ROLES.STUDENT), getNotifications);
router.put('/notifications/:id/read', authorize(ROLES.STUDENT), markNotificationRead);

export default router;
