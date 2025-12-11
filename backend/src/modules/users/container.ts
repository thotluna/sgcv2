import { Container } from 'inversify';
import { TYPES } from './types';
import { UserServiceImpl } from '@users/infrastructure/http/services/user.service.impl';
import { UsersController } from './users.controller';
import { UsersRoutes } from './infrastructure/http/users.routes';

export const usersContainer = new Container();

usersContainer.bind(TYPES.UsersService).to(UserServiceImpl);
usersContainer.bind(TYPES.UsersController).to(UsersController);
usersContainer.bind(TYPES.UsersRoutes).to(UsersRoutes);
