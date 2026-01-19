import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { ListService } from '../domain/list.service';
import { PaginatedRoles, RoleFilterInput } from '../domain/inputs/roles.input';

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TYPES.ListService) private readonly service: ListService) {}

  async execute(filter: RoleFilterInput): Promise<PaginatedRoles> {
    return this.service.getListRoles(filter);
  }
}
