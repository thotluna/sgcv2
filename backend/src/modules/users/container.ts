import { Container } from 'inversify';
import { TYPES } from './types';
import { UsersServiceImp } from './users.service';
import { UsersController } from './users.controller';
import { UsersRoutes } from './users.routes';

export const usersContainer = new Container();

usersContainer.bind(TYPES.UsersService).to(UsersServiceImp);
usersContainer.bind(TYPES.UsersController).to(UsersController);
usersContainer.bind(TYPES.UsersRoutes).to(UsersRoutes);
