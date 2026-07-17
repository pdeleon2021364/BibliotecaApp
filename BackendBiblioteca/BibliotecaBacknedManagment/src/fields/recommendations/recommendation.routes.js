import { Router } from 'express';
import { generateRecommendations, getRecommendationsByUser, deleteRecommendation } from './recommendation.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

router.post('/generate', validateJWT, generateRecommendations);
router.get('/my', validateJWT, getRecommendationsByUser);
router.get('/:usuarioId', validateJWT, requireRole('administrador'), getRecommendationsByUser);
router.delete('/:id', validateJWT, requireRole('administrador'), deleteRecommendation);

export default router;
