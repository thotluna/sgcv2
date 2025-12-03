import { Container } from 'inversify';
import { TYPES } from './types';
import { RbacService } from './rbac.service';

export const rbacContainer = new Container();

rbacContainer.bind<RbacService>(TYPES.RbacService).to(RbacService).inSingletonScope();
