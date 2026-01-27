import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@shared/exceptions';
import { NextFunction, Request, Response } from 'express';

import { rbacService } from '../rbac.service';

export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedException('Authentication required');
      }

      const requiredPermission = `${resource}.${action}`;

      // 1. Check in-memory permissions (from token)
      if (user.permissions && user.permissions.includes(requiredPermission)) {
        return next();
      }

      // 2. Fallback to database check (real-time)
      const id = Number(user.id);
      const hasPerm = await rbacService.hasPermission(id, resource, action);
      if (!hasPerm) {
        throw new ForbiddenException(`Required permission: ${requiredPermission}`);
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
