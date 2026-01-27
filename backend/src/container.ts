import { authContainerModule } from '@modules/auth/di/container';
import { customerContainerModule } from '@modules/customer/di/container';
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
  customerContainerModule,
  supportContainerModule
);

export { container };
