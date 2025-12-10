import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ResponseHelper } from '@shared/utils/response.helpers';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      ResponseHelper.internalError(res, 'Authentication error');
      return;
    }

    if (!user) {
      ResponseHelper.unauthorized(res, info?.message || 'Invalid or missing token');
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
