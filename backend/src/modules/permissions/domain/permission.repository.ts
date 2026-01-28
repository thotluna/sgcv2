import { PermissionFilterInput } from '@permissions/domain/inputs/permission.input';
import { PermissionEntity } from '@permissions/domain/permissions.entity';

export interface PermissionRepository {
  getAll(filter?: PermissionFilterInput): Promise<PermissionEntity[]>;
  findById(id: number): Promise<PermissionEntity | null>;
}
