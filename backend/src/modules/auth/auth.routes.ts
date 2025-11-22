import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));

router.post('/logout',
    passport.authenticate('jwt', { session: false }),
    (req, res) => authController.logout(req, res)
);

router.get('/me',
    passport.authenticate('jwt', { session: false }),
    (req, res) => authController.me(req, res)
);

export default router;

