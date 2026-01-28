import { authContainerModule } from '@modules/auth/di/container';
import { customerContainerModule } from '@modules/customer/di/container';
import { permissionsContainerModule } from '@modules/permissions/di/container';
import { rbacContainerModule } from '@modules/rbac/di/container';
import { rolesContainerModule } from '@modules/roles/di/container';
import { supportContainerModule } from '@modules/support/di/container';
import { usersContainerModule } from '@modules/users/di/container';
import { Container } from 'inversify';

import 'reflect-metadata';

const container = new Container();

container.load(
  authContainerModule,
  usersContainerModule,
  rolesContainerModule,
  permissionsContainerModule,
  customerContainerModule,
  supportContainerModule,
  rbacContainerModule
);

export { container };
