import { Application } from 'express';
import { container } from './container';
import logger from '@config/logger';

import { AuthRoutes } from '@auth/infrastructure/http/auth.routes';
import { UsersRoutes } from '@users/infrastructure/http/users.routes';
import { CustomerRoutes } from '@modules/customer/customer.routes';
import { TYPES as AuthTypes } from '@auth/di/types';
import { TYPES as UsersTypes } from '@users/di/types';
import { TYPES as CustomerTypes } from '@modules/customer/types';

export function loadRoutes(app: Application, prefix: string = '') {
  try {
    const authRoutes = container.get<AuthRoutes>(AuthTypes.AuthRoutes);
    const usersRoutes = container.get<UsersRoutes>(UsersTypes.UsersRoutes);
    const customersRoutes = container.get<CustomerRoutes>(CustomerTypes.CustomerRoutes);

    app.use(`${prefix}/auth`, authRoutes.getRouter());
    app.use(`${prefix}/users`, usersRoutes.getRouter());
    app.use(`${prefix}/customers`, customersRoutes.getRouter());
  } catch (error) {
    logger.error('Error loading routes', { error });
    throw error;
  }
}
