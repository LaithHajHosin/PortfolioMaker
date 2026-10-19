import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/me', authMiddleware, asyncHandler(AuthController.me));
router.put('/profile', authMiddleware, asyncHandler(AuthController.updateProfile));

export default router;
