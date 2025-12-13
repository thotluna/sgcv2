// src/modules/rbac/guards/roles.guard.ts
import { Request, Response, NextFunction } from 'express';
import { rbacService } from '../rbac.service';
import { ResponseHelper } from '@shared/utils/response.helpers';

/**
 * Middleware to ensure the user has at least one of the specified roles.
 * Usage in route definition:
 *   router.get('/admin', requireRoles('admin', 'gerente'), handler);
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        ResponseHelper.unauthorized(res, 'Authentication required');
        return;
      }

      const userId = Number(user.id);
      const hasRole = await rbacService.hasRole(userId, ...allowedRoles);

      if (!hasRole) {
        ResponseHelper.forbidden(res, `Required roles: ${allowedRoles.join(', ')}`);
        return;
      }

      next();
    } catch {
      ResponseHelper.internalError(res, 'Error checking user roles');
    }
  };
};
