import { Router } from 'express';
import { createReturn, getReturns, getReturnById, deleteReturn } from './return.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

router.post('/', validateJWT, requireRole('administrador'), createReturn);
router.get('/', validateJWT, requireRole('administrador'), getReturns);
router.get('/:id', validateJWT, getReturnById);
router.delete('/:id', validateJWT, requireRole('administrador'), deleteReturn);

export default router;
