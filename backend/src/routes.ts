import { Application } from 'express';
import { container } from './container';

import { AuthRoutes } from './modules/auth/infrastructure/http/auth.routes';
import { UsersRoutes } from './modules/users/users.routes';
import { CustomerRoutes } from './modules/customer/customer.routes';
import { TYPES as AuthTypes } from './modules/auth/di/types';
import { TYPES as UsersTypes } from './modules/users/di/types';
import { TYPES as CustomerTypes } from './modules/customer/types';

export function loadRoutes(app: Application, prefix: string = '') {
  const authRoutes = container.get<AuthRoutes>(AuthTypes.AuthRoutes);
  const usersRoutes = container.get<UsersRoutes>(UsersTypes.UsersRoutes);
  const customersRoutes = container.get<CustomerRoutes>(CustomerTypes.CustomerRoutes);

  app.use(`${prefix}/auth`, authRoutes.getRouter());
  app.use(`${prefix}/users`, usersRoutes.getRouter());
  app.use(`${prefix}/customers`, customersRoutes.getRouter());
}
