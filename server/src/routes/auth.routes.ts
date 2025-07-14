import { Router } from 'express';
import { register } from '../controllers/auth.controller';

const router = Router();

// When a POST request comes to /api/auth/register, call the register controller
router.post('/register', register);

export default router;