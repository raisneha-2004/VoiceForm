import type { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { AuthRequest } from '../types/index.js';

export function requestIdMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const existingId = req.header('x-request-id');
  const requestId = existingId || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
