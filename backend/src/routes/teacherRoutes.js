import { Router } from 'express';
import {
  getTeacherSubjects,
  createSubject,
  getEnrolledStudents,
} from '../controllers/teacherController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate, authorize(ROLES.TEACHER, ROLES.ADMIN));

router.get('/subjects', getTeacherSubjects);
router.post('/subjects', createSubject);
router.get('/students', getEnrolledStudents);

export default router;
