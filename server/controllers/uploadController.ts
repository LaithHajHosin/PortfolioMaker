import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const UploadController = {
  async handleUpload(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach an image file (JPEG, PNG, or WebP) under 2MB.',
      });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  },
};
