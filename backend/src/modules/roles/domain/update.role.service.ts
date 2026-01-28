import { RoleEntity } from './roles.entity';
import { UpdateRoleInput } from './inputs/roles.input';

export interface UpdateRoleService {
  update(id: number, data: UpdateRoleInput): Promise<RoleEntity>;
  findByName(name: string): Promise<RoleEntity | null>;
}
