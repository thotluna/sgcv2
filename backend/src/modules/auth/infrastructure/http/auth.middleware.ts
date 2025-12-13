import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { UserDto } from '@sgcv2/shared';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: UserDto, info: Error) => {
      if (err) {
        ResponseHelper.internalError(res, 'Authentication error');
        return;
      }

      if (!user) {
        ResponseHelper.unauthorized(res, info?.message || 'Invalid or missing token');
        return;
      }

      const userWithRoles = user as unknown as { id: number; username: string; roles: string[] };

      req.user = {
        id: userWithRoles.id.toString(),
        username: userWithRoles.username,
        role: userWithRoles.roles[0] || '', // Primary role for legacy compatibility if needed
        roles: userWithRoles.roles
      };
      next();
    }
  )(req, res, next);
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('jwt', { session: false }, (err: Error, user: UserDto) => {
    if (!err && user) {
      const userWithRoles = user as unknown as { id: number; username: string; roles: string[] };
      req.user = {
        id: userWithRoles.id.toString(),
        username: userWithRoles.username,
        role: userWithRoles.roles[0] || '',
        roles: userWithRoles.roles
      };
    }
    next();
  })(req, res, next);
};
