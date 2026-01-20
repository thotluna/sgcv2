import { RoleFilterInput, PaginatedRoles } from './inputs/roles.input';

export interface ListService {
  getListRoles(filter: RoleFilterInput): Promise<PaginatedRoles>;
}
