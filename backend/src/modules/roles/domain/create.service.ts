import { CreateRoleInput } from '@roles/domain/inputs/roles.input';
import { PermissionEntity, RoleEntity } from '@roles/domain/roles.entity';

export interface CreateService {
  findPermissionById(id: number): Promise<PermissionEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  create(data: CreateRoleInput): Promise<RoleEntity>;
}
