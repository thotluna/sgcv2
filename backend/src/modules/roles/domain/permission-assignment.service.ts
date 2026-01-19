import { PermissionEntity } from './roles.entity';

export interface PermissionAssignmentService {
  findPermissionById(id: number): Promise<PermissionEntity | null>;
  addPermissions(roleId: number, permissionIds: number[]): Promise<void>;
  removePermissions(roleId: number, permissionIds: number[]): Promise<void>;
}
