import { TYPES } from '@roles/di/types';
import { PaginatedRoles, RoleFilterInput } from '@roles/domain/inputs/roles.input';
import { ListService } from '@roles/domain/list.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TYPES.ListService) private readonly service: ListService) {}

  async execute(filter: RoleFilterInput): Promise<PaginatedRoles> {
    return this.service.getListRoles(filter);
  }
}
