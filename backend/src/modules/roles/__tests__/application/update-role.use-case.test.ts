import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { mockPermission, mockRole } from '@roles/__tests__/helpers';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { UpdateRoleService } from '@roles/domain/update.role.service';

const mockUpdateService = {
  update: jest.fn(),
  findByName: jest.fn(),
} as unknown as jest.Mocked<UpdateRoleService>;

const mockGetRoleService = {
  getRole: jest.fn(),
} as unknown as jest.Mocked<GetRoleService>;

const mockGetPermissionsService = {
  findPermissionById: jest.fn(),
} as unknown as jest.Mocked<GetPermissions>;

describe('UpdateRoleUseCase', () => {
  let useCase: UpdateRoleUseCase;

  beforeEach(() => {
    useCase = new UpdateRoleUseCase(
      mockUpdateService,
      mockGetRoleService,
      mockGetPermissionsService
    );
    jest.clearAllMocks();
  });

  const updateInput = {
    name: 'Updated Name',
    description: 'Updated description',
    permissionIds: [1],
  };

  it('should update a role successfully', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockUpdateService.findByName.mockResolvedValue(null);
    mockGetPermissionsService.findPermissionById.mockResolvedValue(mockPermission);
    mockUpdateService.update.mockResolvedValue({ ...mockRole, ...updateInput });

    const result = await useCase.execute(1, updateInput);

    expect(mockGetRoleService.getRole).toHaveBeenCalledWith(1);
    expect(mockUpdateService.update).toHaveBeenCalledWith(1, updateInput);
    expect(result.name).toBe(updateInput.name);
  });

  it('should throw RoleNotFoundException if role does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(null);

    await expect(useCase.execute(1, updateInput)).rejects.toThrow(RoleNotFoundException);
  });
});
