export interface PermissionAssignmentService {
  addPermissions(roleId: number, permissionIds: number[]): Promise<void>;
  removePermissions(roleId: number, permissionIds: number[]): Promise<void>;
}
