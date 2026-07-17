import { Router } from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from './book.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

router.get('/', validateJWT, getBooks);
router.get('/:id', validateJWT, getBookById);
router.post('/', validateJWT, requireRole('administrador'), createBook);
router.put('/:id', validateJWT, requireRole('administrador'), updateBook);
router.delete('/:id', validateJWT, requireRole('administrador'), deleteBook);

export default router;
