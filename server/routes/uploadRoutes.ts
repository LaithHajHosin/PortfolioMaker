import { Router } from 'express';
import { UploadController } from '../controllers/uploadController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { uploadMiddleware } from '../middleware/uploadMiddleware.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

const router = Router();

router.post(
  '/',
  authMiddleware,
  uploadMiddleware.single('file'),
  asyncHandler(UploadController.handleUpload)
);

export default router;
