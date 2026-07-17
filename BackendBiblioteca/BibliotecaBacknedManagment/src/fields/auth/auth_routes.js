import { Router } from 'express';
import { login, register, listUsers } from './auth_controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', listUsers);

export default router;
