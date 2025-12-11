import 'reflect-metadata';
import { Container } from 'inversify';
import { authContainerModule } from '@modules/auth/di/container';
import { usersContainerModule } from '@modules/users/di/container';
import { customerContainerModule } from '@modules/customer/container';

const container = new Container();

container.load(authContainerModule, usersContainerModule, customerContainerModule);

export { container };
