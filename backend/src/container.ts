import 'reflect-metadata';
import { Container } from 'inversify';
import { authContainerModule } from '@modules/auth/di/container';
import { usersContainerModule } from '@modules/users/di/container';
import { rolesContainerModule } from '@modules/roles/di/container';
import { customerContainerModule } from '@modules/customer/di/container';
import { supportContainerModule } from '@modules/support/di/container';

const container = new Container();

container.load(
  authContainerModule,
  usersContainerModule,
  rolesContainerModule,
  customerContainerModule,
  supportContainerModule
);

export { container };
