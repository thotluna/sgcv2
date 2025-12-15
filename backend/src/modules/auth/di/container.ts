import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { TYPES } from '@auth/di/types';
import { LoginUseCaseService } from '@auth/application/login.use-case.service';
import { AuthController } from '@auth/infrastructure/http/auth.controller';
import { AuthRoutes } from '@auth/infrastructure/http/auth.routes';
import { LocalStrategy } from '@auth/infrastructure/http/strategies/local.strategy';
import { JwtStrategy } from '@auth/infrastructure/http/strategies/jwt.strategy';
import { UserValidationService } from '../domain/user-validation.service';
import { AuthService } from '../infrastructure/http/auth.service';
import { LoginService } from '../domain/login.service';

export const authContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<UserValidationService>(TYPES.UserValidationService).to(AuthService);
  option.bind<LoginService>(TYPES.LoginService).to(AuthService);
  option.bind<LoginUseCaseService>(TYPES.LoginUseCaseService).to(LoginUseCaseService);
  option.bind<AuthController>(TYPES.AuthController).to(AuthController);
  option.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
  option.bind<LocalStrategy>(TYPES.LocalStrategy).to(LocalStrategy);
  option.bind<JwtStrategy>(TYPES.JwtStrategy).to(JwtStrategy);
});
