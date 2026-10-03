import { Router } from 'express';
import {
  getTeacherSubjects,
  createSubject,
  getAssignedClasses,
  getClassStudents,
  getTeacherProfile,
  updateTeacherProfile,
} from '../controllers/teacherController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate, authorize(ROLES.TEACHER, ROLES.ADMIN));

router.get('/profile', getTeacherProfile);
router.put('/profile', updateTeacherProfile);
router.get('/subjects', getTeacherSubjects);
router.post('/subjects', createSubject);
router.get('/classes', getAssignedClasses);
router.get('/classes/:assignmentId/students', getClassStudents);

export default router;
