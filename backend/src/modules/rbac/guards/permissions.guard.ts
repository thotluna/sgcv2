import { Request, Response, NextFunction } from 'express';
import { rbacService } from '../rbac.service';
import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@shared/exceptions';

export const requirePermission = (module: string, action: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedException('Authentication required');
      }
      const id = Number(user.id);
      const hasPerm = await rbacService.hasPermission(id, module, action);
      if (!hasPerm) {
        throw new ForbiddenException(`Required permission: ${module}.${action}`);
      }

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        next(error);
        return;
      }
      next(new InternalServerErrorException('Error checking permission'));
    }
  };
};
