import { Router } from 'express';
import { createField, getFields, updateUser, deleteUser } from './usuarios.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

router.post('/create', validateJWT, requireRole('administrador'), createField);
router.get('/', validateJWT, getFields);
router.put('/:id', validateJWT, requireRole('administrador'), updateUser);
router.delete('/:id', validateJWT, requireRole('administrador'), deleteUser);

export default router;
