import { Request, Response, NextFunction } from 'express';
import { rbacService } from '../rbac.service';
import { UserEntity } from '@modules/users/domain/user-entity';
import { ResponseHelper } from '@shared/utils/response.helpers';

export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as UserEntity;

      if (!user) {
        ResponseHelper.unauthorized(res, 'Authentication required');
      }
      const hasPerm = await rbacService.hasPermission(user.id, module, action);
      if (!hasPerm) {
        ResponseHelper.forbidden(res, `Required permission: ${module}.${action}`);
      }
      return next();
    } catch (error) {
      console.error('Permission guard error:', error);
      ResponseHelper.internalError(res, 'Error checking permission');
    }
  };
};
