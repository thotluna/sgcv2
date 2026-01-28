import { CreateRoleInput } from '@roles/domain/inputs/roles.input';
import { RoleEntity } from '@roles/domain/roles.entity';

export interface CreateService {
  findByName(name: string): Promise<RoleEntity | null>;
  create(data: CreateRoleInput): Promise<RoleEntity>;
}
