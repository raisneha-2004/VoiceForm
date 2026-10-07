import type { Request, Response, NextFunction } from 'express';
import { sanitizeMongoInput } from '../utils/sanitizer.js';

export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeMongoInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeMongoInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeMongoInput(req.params);
  }
  next();
}
