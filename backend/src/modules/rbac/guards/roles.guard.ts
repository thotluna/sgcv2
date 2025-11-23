// src/modules/rbac/guards/roles.guard.ts
import { Request, Response, NextFunction } from 'express';
import { rbacService } from '../rbac.service';

/**
 * Middleware to ensure the user has at least one of the specified roles.
 * Usage in route definition:
 *   router.get('/admin', requireRoles('admin', 'gerente'), handler);
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
      }
      const hasRole = await rbacService.hasRole(user.id, ...allowedRoles);
      if (!hasRole) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Required roles: ${allowedRoles.join(', ')}`,
        });
      }
      return next();
    } catch (error) {
      console.error('Role guard error:', error);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', message: 'Error checking user roles' });
    }
  };
};
