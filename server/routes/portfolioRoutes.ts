import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolioController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

const router = Router();

router.get('/:username', asyncHandler(PortfolioController.getByUsername));
router.put('/', authMiddleware, asyncHandler(PortfolioController.updatePortfolio));

export default router;
