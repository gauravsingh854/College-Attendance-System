import { Router } from 'express';
import { getAllSubjects } from '../controllers/subjectController.js';

const router = Router();

router.get('/', getAllSubjects);

export default router;
