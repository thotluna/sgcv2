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
import { GetUseCase } from '../application/get.use-case';
import { UpdateMeUseCase } from '../application/update-me.use-case';
import { UserRepository } from '../domain/user-repository';
import { ShowUserService } from '../domain/show.service';
import { ListUseCase } from '../application/list.use-case';
import { CreateUseCase } from '../application/create.use-case';
import { UpdateUseCase } from '../application/update.use-case';

export const usersContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option
    .bind<UserCredentialsRepository>(AuthTypes.UserCredentialsRepository)
    .to(UsersPrismaRepository);
  option
    .bind<AuthUserIdentityRepository>(AuthTypes.AuthUserIdentityRepository)
    .to(UsersPrismaRepository);
  option.bind<UserRepository>(TYPES.UserRepository).to(UsersPrismaRepository);
  option.bind<GetUseCase>(TYPES.GetUseCase).to(GetUseCase);
  option.bind<UpdateMeUseCase>(TYPES.UpdateMeUseCaseService).to(UpdateMeUseCase);
  option.bind<UsersService>(TYPES.UsersService).to(UserServiceImpl);
  option.bind<ShowUserService>(TYPES.ShowUserService).to(UserServiceImpl);
  option.bind<UsersController>(TYPES.UsersController).to(UsersController);
  option.bind<UsersRoutes>(TYPES.UsersRoutes).to(UsersRoutes);
  option.bind<ListUseCase>(TYPES.ShowAllUseCaseService).to(ListUseCase);
  option.bind<CreateUseCase>(TYPES.CreateUserUseCaseService).to(CreateUseCase);
  option.bind<UpdateUseCase>(TYPES.UpdateUserUseCaseService).to(UpdateUseCase);
  option.bind<UserServiceImpl>(TYPES.ListUsersService).to(UserServiceImpl);
  option.bind<UserServiceImpl>(TYPES.CreateUserService).to(UserServiceImpl);
  option.bind<UserServiceImpl>(TYPES.UpdateUserService).to(UserServiceImpl);
});
