import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { UsersService } from '@users/domain/user.service';
import { UserCredentialsRepository } from '@modules/auth/domain/user-credentials.repository';
import { UserServiceImpl } from '@modules/users/infrastructure/http/user.service.impl';
import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { UsersPrismaRepository } from '@users/infrastructure/persist/users-prisma.repository';
import { UsersRoutes } from '@modules/users/infrastructure/http/users.routes';
import { TYPES } from '@users/di/types';
import { TYPES as AuthTypes } from '@auth/di/types';
import { AuthUserIdentityRepository } from '@modules/auth/domain/auth-user-identity.repository';
import { ShowMeUseCaseService } from '../application/show-me.use-case.service';
import { UpdateMeUseCaseService } from '../application/update-me.use-case.service';
import { UserRepository } from '../domain/user-repository';
import { ShowUserService } from '../domain/show.service';
import { ShowAllUseCaseService } from '../application/show-all.use-case.service';
import { CreateUserUseCaseService } from '../application/create-user.use-case.service';
import { ShowUserUseCaseService } from '../application/show-user.use-case.service';
import { UpdateUserUseCaseService } from '../application/update-user.use-case.service';

export const usersContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option
    .bind<UserCredentialsRepository>(AuthTypes.UserCredentialsRepository)
    .to(UsersPrismaRepository);
  option
    .bind<AuthUserIdentityRepository>(AuthTypes.AuthUserIdentityRepository)
    .to(UsersPrismaRepository);
  option.bind<UserRepository>(TYPES.UserRepository).to(UsersPrismaRepository);
  option.bind<ShowMeUseCaseService>(TYPES.ShowMeUseCaseService).to(ShowMeUseCaseService);
  option.bind<UpdateMeUseCaseService>(TYPES.UpdateMeUseCaseService).to(UpdateMeUseCaseService);
  option.bind<UsersService>(TYPES.UsersService).to(UserServiceImpl);
  option.bind<ShowUserService>(TYPES.ShowUserService).to(UserServiceImpl);
  option.bind<UsersController>(TYPES.UsersController).to(UsersController);
  option.bind<UsersRoutes>(TYPES.UsersRoutes).to(UsersRoutes);
  option.bind<ShowAllUseCaseService>(TYPES.ShowAllUseCaseService).to(ShowAllUseCaseService);
  option
    .bind<CreateUserUseCaseService>(TYPES.CreateUserUseCaseService)
    .to(CreateUserUseCaseService);
  option.bind<ShowUserUseCaseService>(TYPES.ShowUserUseCaseService).to(ShowUserUseCaseService);
  option
    .bind<UpdateUserUseCaseService>(TYPES.UpdateUserUseCaseService)
    .to(UpdateUserUseCaseService);
  option.bind<UserServiceImpl>(TYPES.ListUsersService).to(UserServiceImpl);
  option.bind<UserServiceImpl>(TYPES.CreateUserService).to(UserServiceImpl);
  option.bind<UserServiceImpl>(TYPES.UpdateUserService).to(UserServiceImpl);
});
