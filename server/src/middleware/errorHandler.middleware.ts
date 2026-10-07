import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import type { AuthRequest } from '../types/index.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = (req as AuthRequest).requestId || 'unknown';

  // Operational error
  if (err instanceof ApiError) {
    logger.warn(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      requestId,
      details: err.details,
      path: req.originalUrl,
      method: req.method
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.constructor.name,
        message: err.message,
        details: err.details
      },
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `${field} already exists. Please choose another.`;

    logger.warn(`Duplicate key error: ${message}`, { requestId, path: req.originalUrl });

    return res.status(409).json({
      success: false,
      error: {
        code: 'ConflictError',
        message,
        details: { field, duplicateValue: err.keyValue?.[field] }
      },
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid resource identifier format: ${err.value}`;

    return res.status(400).json({
      success: false,
      error: {
        code: 'BadRequestError',
        message
      },
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Unhandled / programmer error
  logger.error('Unhandled System Error:', err, {
    requestId,
    path: req.originalUrl,
    method: req.method
  });

  return res.status(500).json({
    success: false,
    error: {
      code: 'InternalServerError',
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred. Please contact support.'
          : err.message || 'Internal Server Error',
      stack: env.NODE_ENV === 'development' ? err.stack : undefined
    },
    requestId,
    timestamp: new Date().toISOString()
  });
}
