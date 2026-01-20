import { AddPermissionsToRoleUseCase } from '@roles/application/add-permissions-to-role.use-case';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { GetRoleService } from '@roles/domain/get.role.service';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { mockRole, mockPermission } from '@roles/__tests__/helpers';

const mockPermissionAssignmentService = {
  findPermissionById: jest.fn(),
  addPermissions: jest.fn(),
  removePermissions: jest.fn(),
} as unknown as jest.Mocked<PermissionAssignmentService>;

const mockGetRoleService = {
  getRole: jest.fn(),
} as unknown as jest.Mocked<GetRoleService>;

describe('AddPermissionsToRoleUseCase', () => {
  let useCase: AddPermissionsToRoleUseCase;

  beforeEach(() => {
    useCase = new AddPermissionsToRoleUseCase(mockPermissionAssignmentService, mockGetRoleService);
    jest.clearAllMocks();
  });

  const roleId = 1;
  const permissionIds = [1, 2];

  it('should add permissions successfully', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockPermissionAssignmentService.findPermissionById.mockResolvedValue(mockPermission);
    mockPermissionAssignmentService.addPermissions.mockResolvedValue(undefined);

    await useCase.execute(roleId, permissionIds);

    expect(mockGetRoleService.getRole).toHaveBeenCalledWith(roleId);
    expect(mockPermissionAssignmentService.findPermissionById).toHaveBeenCalledTimes(2);
    expect(mockPermissionAssignmentService.addPermissions).toHaveBeenCalledWith(
      roleId,
      permissionIds
    );
  });

  it('should throw RoleNotFoundException if role does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(null);

    await expect(useCase.execute(roleId, permissionIds)).rejects.toThrow(RoleNotFoundException);
    expect(mockPermissionAssignmentService.addPermissions).not.toHaveBeenCalled();
  });

  it('should throw PermissionNotFoundException if some permission does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockPermissionAssignmentService.findPermissionById
      .mockResolvedValueOnce(mockPermission)
      .mockResolvedValueOnce(null);

    await expect(useCase.execute(roleId, permissionIds)).rejects.toThrow(
      PermissionNotFoundException
    );
    expect(mockPermissionAssignmentService.addPermissions).not.toHaveBeenCalled();
  });
});
