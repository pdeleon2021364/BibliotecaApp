import { Router } from 'express';
import { createLoan, getLoans, getLoanById, getMyLoans, updateLoan, deleteLoan } from './loan.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

router.post('/', validateJWT, requireRole('administrador', 'cliente'), createLoan);
router.get('/my-loans', validateJWT, getMyLoans);
router.get('/', validateJWT, requireRole('administrador'), getLoans);
router.get('/:id', validateJWT, getLoanById);
router.put('/:id', validateJWT, requireRole('administrador'), updateLoan);
router.delete('/:id', validateJWT, requireRole('administrador'), deleteLoan);

export default router;
