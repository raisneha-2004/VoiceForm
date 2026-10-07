import type { Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/apiError.js';
import type { AuthRequest, Role } from '../types/index.js';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required to access this resource.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Role '${req.user.role}' is not authorized. Required: [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
}
