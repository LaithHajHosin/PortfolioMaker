import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('API Error:', err?.message || err);

  // Ensure JSON response header
  res.setHeader('Content-Type', 'application/json');

  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const fieldName = firstIssue?.path?.length ? `"${firstIssue.path.join('.')}" ` : '';
    const primaryMessage = firstIssue?.message
      ? `${fieldName}${firstIssue.message}`.trim()
      : 'Validation failed';

    res.status(400).json({
      success: false,
      message: primaryMessage,
      errors: err.issues.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File size exceeds 2MB limit.',
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please sign in again.',
    });
    return;
  }

  if (err.message && err.message.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  const statusCode = typeof err.status === 'number' && err.status >= 400 && err.status < 600
    ? err.status
    : typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
}
