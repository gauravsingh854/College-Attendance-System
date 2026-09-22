import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validateRequest(validateRegister), register);
router.post('/login', validateRequest(validateLogin), login);
router.get('/me', authenticate, getMe);

export default router;
