import { PermissionFilterInput } from '@roles/domain/inputs/permission.input';
import { PermissionEntity } from '@roles/domain/roles.entity';

export interface PermissionRepository {
  getAll(filter?: PermissionFilterInput): Promise<PermissionEntity[]>;
  findById(id: number): Promise<PermissionEntity | null>;
}
