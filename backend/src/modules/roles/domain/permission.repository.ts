import { PermissionFilterInput } from './inputs/permission.input';
import { PermissionEntity } from './roles.entity';

export interface PermissionRepository {
  getAll(filter?: PermissionFilterInput): Promise<PermissionEntity[]>;
  findById(id: number): Promise<PermissionEntity | null>;
  findByIds(ids: number[]): Promise<PermissionEntity[]>;
}
