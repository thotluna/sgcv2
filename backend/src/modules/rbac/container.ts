import { Container } from 'inversify';

import { RbacService } from './rbac.service';
import { TYPES } from './types';

export const rbacContainer = new Container();

rbacContainer.bind<RbacService>(TYPES.RbacService).to(RbacService).inSingletonScope();
