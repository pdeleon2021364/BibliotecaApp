import { Router } from 'express';
import { generateRecommendations, getRecommendationsByUser, recommendByCategory } from '../controllers/recommendations.controller.js';
import { validateJWT } from '../../middlewares/validate_jwt.js';

const router = Router();

router.post('/generate', validateJWT, generateRecommendations);
router.get('/my', validateJWT, getRecommendationsByUser);
router.get('/category/:category', validateJWT, recommendByCategory);

export default router;
