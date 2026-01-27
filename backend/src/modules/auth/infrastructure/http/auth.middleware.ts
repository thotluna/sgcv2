import { AuthUser } from '@modules/auth/domain/auth-user';
import { InternalServerErrorException, UnauthorizedException } from '@shared/exceptions';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

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

      req.user = {
        id: user.id.toString(),
        username: user.username,
        role: user.roles[0] || '',
        roles: user.roles,
        permissions: user.permissions,
      };
      next();
    }
  )(req, res, next);
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('jwt', { session: false }, (err: Error, user: AuthUser) => {
    if (!err && user) {
      req.user = {
        id: user.id.toString(),
        username: user.username,
        role: user.roles?.[0] || '',
        roles: user.roles || [],
        permissions: user.permissions || [],
      };
    }
    next();
  })(req, res, next);
};
