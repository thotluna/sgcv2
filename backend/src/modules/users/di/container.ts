import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { UsersPrismaRepository } from '../infrastructure/persist/users-prisma.repository';
import { TYPES } from '../di/types';
import { UserRepository } from '../domain/user-repository';
import { UsersService, UsersServiceImp } from '../users.service';
import { UsersController } from '../users.controller';
import { UsersRoutes } from '../users.routes';

export const usersContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<UserRepository>(TYPES.UserRepository).to(UsersPrismaRepository);
  option.bind<UsersService>(TYPES.UsersService).to(UsersServiceImp);
  option.bind<UsersController>(TYPES.UsersController).to(UsersController);
  option.bind<UsersRoutes>(TYPES.UsersRoutes).to(UsersRoutes);
});
