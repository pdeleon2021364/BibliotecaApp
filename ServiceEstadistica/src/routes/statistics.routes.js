import { Router } from 'express';
import { getStatistics, getStatisticsByCategory, getTopBooks } from '../controllers/statistics.controller.js';
import { validateJWT } from '../../middlewares/validate_jwt.js';

const router = Router();

router.get('/', validateJWT, getStatistics);
router.get('/categories', validateJWT, getStatisticsByCategory);
router.get('/top', validateJWT, getTopBooks);

export default router;
