import { Request, Response, NextFunction } from 'express';
import { rbacService } from '../rbac.service';
import { ResponseHelper } from '@shared/utils/response.helpers';

export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        ResponseHelper.unauthorized(res, 'Authentication required');
        return;
      }
      const id = Number(user.id);
      const hasPerm = await rbacService.hasPermission(id, module, action);
      if (!hasPerm) {
        ResponseHelper.forbidden(res, `Required permission: ${module}.${action}`);
        return;
      }

      next();
    } catch (error) {
      console.error('Permission guard error:', error);
      ResponseHelper.internalError(res, 'Error checking permission');
    }
  };
};
