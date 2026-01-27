import { TYPES as AuthTypes } from '@auth/di/types';
import { AuthRoutes } from '@auth/infrastructure/http/auth.routes';
import logger from '@config/logger';
import { TYPES as CustomerTypes } from '@modules/customer/di/types';
import { CustomerRoutes } from '@modules/customer/infrastructure/http/customer.routes';
import { TYPES as RolesTypes } from '@modules/roles/di/types';
import { RolesRoutes } from '@modules/roles/infrastructure/http/roles.routes';
import { TYPES as SupportTypes } from '@modules/support/di/types';
import { SupportRoutes } from '@modules/support/infrastructure/http/support.routes';
import { TYPES as UsersTypes } from '@users/di/types';
import { UsersRoutes } from '@users/infrastructure/http/users.routes';
import { Application } from 'express';

import { container } from './container';

export function loadRoutes(app: Application, prefix: string = '') {
  try {
    const authRoutes = container.get<AuthRoutes>(AuthTypes.AuthRoutes);
    const usersRoutes = container.get<UsersRoutes>(UsersTypes.UsersRoutes);
    const rolesRoutes = container.get<RolesRoutes>(RolesTypes.RolesRoutes);
    const customersRoutes = container.get<CustomerRoutes>(CustomerTypes.CustomerRoutes);
    const supportRoutes = container.get<SupportRoutes>(SupportTypes.SupportRoutes);

    app.use(`${prefix}/auth`, authRoutes.getRouter());
    app.use(`${prefix}/users`, usersRoutes.getRouter());
    app.use(`${prefix}/roles`, rolesRoutes.getRouter());
    app.use(`${prefix}/customers`, customersRoutes.getRouter());
    app.use(`${prefix}/`, supportRoutes.getRouter());
  } catch (error) {
    logger.error('Error loading routes', {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              ...(error as any),
            }
          : error,
    });
    throw error;
  }
}
