import { PaginatedRoles, RoleFilterInput } from './inputs/roles.input';

export interface ListService {
  getListRoles(filter: RoleFilterInput): Promise<PaginatedRoles>;
}
