import { Router } from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  enrollFace,
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

export default router;
