import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserDto } from '@sgcv2/shared';
import { AuthUser } from '@modules/auth/domain/auth-user';
import { InternalServerErrorException, UnauthorizedException } from '@shared/exceptions';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: AuthUser, info: Error) => {
      if (err) {
        return next(new InternalServerErrorException('Authentication error'));
      }

      if (!user) {
        return next(new UnauthorizedException(info?.message || 'Invalid or missing token'));
      }

      const userWithRoles = user as unknown as { id: number; username: string; roles: string[] };

      req.user = {
        id: userWithRoles.id.toString(),
        username: userWithRoles.username,
        role: userWithRoles.roles[0] || '',
        roles: userWithRoles.roles,
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
        roles: userWithRoles.roles,
      };
    }
    next();
  })(req, res, next);
};
