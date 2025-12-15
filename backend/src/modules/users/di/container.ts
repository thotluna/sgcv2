import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { UserRepository } from '@users/domain/user-repository';
import { UsersService } from '@users/domain/user.service';
import { UserCredentialsRepository } from '@modules/auth/domain/user-credentials.repository';
import { UserServiceImpl } from '@modules/users/infrastructure/http/user.service.impl';
import { UsersController } from '@users/infrastructure/http/user.controller';
import { UsersPrismaRepository } from '@users/infrastructure/persist/users-prisma.repository';
import { UsersRoutes } from '@modules/users/infrastructure/http/users.routes';
import { TYPES } from '@users/di/types';
import { TYPES as AuthTypes } from '@auth/di/types';
import { AuthUserIdentityRepository } from '@modules/auth/domain/auth-user-identity.repository';

export const usersContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option
    .bind<UserCredentialsRepository>(AuthTypes.UserCredentialsRepository)
    .to(UsersPrismaRepository);
  option
    .bind<AuthUserIdentityRepository>(AuthTypes.AuthUserIdentityRepository)
    .to(UsersPrismaRepository);
  option.bind<UserRepository>(TYPES.UserRepository).to(UsersPrismaRepository);
  option.bind<UsersService>(TYPES.UsersService).to(UserServiceImpl);
  option.bind<UsersController>(TYPES.UsersController).to(UsersController);
  option.bind<UsersRoutes>(TYPES.UsersRoutes).to(UsersRoutes);
});
