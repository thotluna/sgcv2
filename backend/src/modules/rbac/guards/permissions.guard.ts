// src/modules/rbac/guards/permissions.guard.ts
import { Request, Response, NextFunction } from 'express';
import { rbacService } from '../rbac.service';

/**
 * Middleware to ensure the user has a specific permission.
 * Usage in route definition:
 *   router.get('/ods/create', requirePermission('ODS', 'CREAR'), handler);
 */
export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
      }
      const hasPerm = await rbacService.hasPermission(user.id, module, action);
      if (!hasPerm) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Required permission: ${module}.${action}`,
        });
      }
      return next();
    } catch (error) {
      console.error('Permission guard error:', error);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', message: 'Error checking permission' });
    }
  };
};
