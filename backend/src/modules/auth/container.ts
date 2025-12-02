import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthService, AuthServiceImp } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRoutes } from './auth.routes';

const authContainer = new Container();

authContainer.bind<AuthService>(TYPES.AuthService).to(AuthServiceImp);
authContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
authContainer.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);

export { authContainer };
