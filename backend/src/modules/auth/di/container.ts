import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { TYPES } from '@auth/di/types';
import { AuthServiceImpl } from '@auth/infrastructure/services/auth-service-impl';
import { LoginUseCaseService } from '@auth/application/login.use-case.service';
import { AuthController } from '@auth/infrastructure/http/auth.controller';
import { AuthRoutes } from '@auth/infrastructure/http/auth.routes';
import { LocalStrategy } from '@auth/infrastructure/http/strategies/local.strategy';
import { JwtStrategy } from '@auth/infrastructure/http/strategies/jwt.strategy';
import { AuthService } from '@auth/domain/auth-service';
import { AuthLoginService } from '@auth/domain/auth.login.service';

export const authContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl);
  option.bind<AuthLoginService>(TYPES.AuthLoginService).to(AuthServiceImpl);
  option.bind<LoginUseCaseService>(TYPES.LoginUseCaseService).to(LoginUseCaseService);
  option.bind<AuthController>(TYPES.AuthController).to(AuthController);
  option.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
  option.bind<LocalStrategy>(TYPES.LocalStrategy).to(LocalStrategy);
  option.bind<JwtStrategy>(TYPES.JwtStrategy).to(JwtStrategy);
});
