import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthService, AuthServiceImp } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRoutes } from './auth.routes';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

const authContainer = new Container();

authContainer.bind<AuthService>(TYPES.AuthService).to(AuthServiceImp);
authContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
authContainer.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
authContainer.bind<LocalStrategy>(TYPES.LocalStrategy).to(LocalStrategy);
authContainer.bind<JwtStrategy>(TYPES.JwtStrategy).to(JwtStrategy);

export { authContainer };
