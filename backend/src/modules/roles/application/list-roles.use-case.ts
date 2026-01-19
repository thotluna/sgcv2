import { injectable, inject } from 'inversify';
import { TYPES } from '@roles/di/types';
import { ListService } from '@roles/domain/list.service';
import { PaginatedRoles, RoleFilterInput } from '@roles/domain/inputs/roles.input';

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TYPES.ListService) private readonly service: ListService) {}

  async execute(filter: RoleFilterInput): Promise<PaginatedRoles> {
    return this.service.getListRoles(filter);
  }
}
