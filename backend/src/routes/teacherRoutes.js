import { Router } from 'express';
import {
  getTeacherSubjects,
  createSubject,
  getAssignedClasses,
  getClassStudents,
  getAllStudents,
  getTeacherProfile,
  updateTeacherProfile,
  getTodaySchedule,
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
router.get('/students', getAllStudents);
router.get('/classes/:assignmentId/students', getClassStudents);
router.get('/schedule/today', getTodaySchedule);

export default router;
