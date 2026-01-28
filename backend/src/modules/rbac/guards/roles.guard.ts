// src/modules/rbac/guards/roles.guard.ts
import { TYPES } from '@modules/rbac/di/types';
import { RbacService } from '@modules/rbac/rbac.service';
import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@shared/exceptions';
import { NextFunction, Request, Response } from 'express';

import { container } from '../../../container';

/**
 * Middleware to ensure the user has at least one of the specified roles.
 * Usage in route definition:
 *   router.get('/admin', requireRoles('admin', 'gerente'), handler);
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedException('Authentication required');
      }

      const userId = Number(user.id);
      const rbacService = container.get<RbacService>(TYPES.RbacService);
      const hasRole = await rbacService.hasRole(userId, ...allowedRoles);

      if (!hasRole) {
        throw new ForbiddenException(`Required roles: ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        next(error);
        return;
      }
      next(new InternalServerErrorException('Error checking user roles'));
    }
  };
};
