import { CreateRoleInput, RoleFilterInput, UpdateRoleInput } from './inputs/roles.input';
import { RoleEntity } from './roles.entity';
import { PaginatedRoles } from './inputs/roles.input';

export interface RoleRepository {
  getAll(filter: RoleFilterInput): Promise<PaginatedRoles>;
  findById(id: number): Promise<RoleEntity | null>;
  findByIdWithPermissions(id: number): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  create(data: CreateRoleInput): Promise<RoleEntity>;
  update(id: number, data: UpdateRoleInput): Promise<RoleEntity>;
  delete(id: number): Promise<void>;
  addPermissions(roleId: number, permissionIds: number[]): Promise<void>;
  removePermissions(roleId: number, permissionIds: number[]): Promise<void>;
  countUsersWithRole(roleId: number): Promise<number>;
}
