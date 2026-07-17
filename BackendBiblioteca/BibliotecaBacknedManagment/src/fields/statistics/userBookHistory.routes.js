import { Router } from 'express';
import { getStatistics, getStatisticsByCategory, getTopBooks } from './userBookHistory.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

router.get('/', validateJWT, requireRole('administrador'), getStatistics);
router.get('/by-category', validateJWT, requireRole('administrador'), getStatisticsByCategory);
router.get('/top', validateJWT, getTopBooks);

export default router;
