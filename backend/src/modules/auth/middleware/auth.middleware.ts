import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    return passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Authentication error'
            });
            return;
        }

        if (!user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: info?.message || 'Invalid or missing token'
            });
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

