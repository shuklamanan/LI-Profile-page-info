import { Request, Response, NextFunction } from 'express';
import { AppException } from '../core/exceptions';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || '';

  if (err instanceof AppException) {
    res.status(err.httpStatus).json({
      error: {
        code: err.code,
        message: err.message,
        request_id: requestId,
      },
    });
    return;
  }
  console.error(`[Unhandled Exception] ${err?.message || err}`, err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
      request_id: requestId,
    },
  });
}
