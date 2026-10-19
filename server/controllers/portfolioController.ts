import { Request, Response } from 'express';
import { Repository } from '../db/repository.ts';
import { updatePortfolioSchema } from '../validators/portfolioValidator.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const PortfolioController = {
  async getByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    if (!username) {
      res.status(400).json({
        success: false,
        message: 'Username parameter is required.',
      });
      return;
    }

    const result = await Repository.getPublicPortfolioByUsername(username);
    if (!result) {
      res.status(404).json({
        success: false,
        message: `Portfolio for user "${username}" was not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  },

  async updatePortfolio(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required to update portfolio.',
      });
      return;
    }

    const validatedData = updatePortfolioSchema.parse(req.body);

    const updated = await Repository.updatePortfolioByUserId(req.user._id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully!',
      data: updated,
    });
  },
};
