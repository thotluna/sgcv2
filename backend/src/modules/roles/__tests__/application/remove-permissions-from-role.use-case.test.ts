import { mockRole } from '@roles/__tests__/helpers';
import { RemovePermissionsFromRoleUseCase } from '@roles/application/remove-permissions-from-role.use-case';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';

const mockPermissionAssignmentService = {
  findPermissionById: jest.fn(),
  addPermissions: jest.fn(),
  removePermissions: jest.fn(),
} as unknown as jest.Mocked<PermissionAssignmentService>;

const mockGetRoleService = {
  getRole: jest.fn(),
} as unknown as jest.Mocked<GetRoleService>;

describe('RemovePermissionsFromRoleUseCase', () => {
  let useCase: RemovePermissionsFromRoleUseCase;

  beforeEach(() => {
    useCase = new RemovePermissionsFromRoleUseCase(
      mockPermissionAssignmentService,
      mockGetRoleService
    );
    jest.clearAllMocks();
  });

  const roleId = 1;
  const permissionIds = [1, 2];

  it('should remove permissions successfully', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockPermissionAssignmentService.removePermissions.mockResolvedValue(undefined);

    await useCase.execute(roleId, permissionIds);

    expect(mockGetRoleService.getRole).toHaveBeenCalledWith(roleId);
    expect(mockPermissionAssignmentService.removePermissions).toHaveBeenCalledWith(
      roleId,
      permissionIds
    );
  });

  it('should throw RoleNotFoundException if role does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(null);

    await expect(useCase.execute(roleId, permissionIds)).rejects.toThrow(RoleNotFoundException);
    expect(mockPermissionAssignmentService.removePermissions).not.toHaveBeenCalled();
  });
});
