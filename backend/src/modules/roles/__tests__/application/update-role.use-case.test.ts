import { mockPermission, mockRole } from '@roles/__tests__/helpers';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { UpdateRoleService } from '@roles/domain/update.role.service';

const mockUpdateService = {
  update: jest.fn(),
  findByName: jest.fn(),
  findPermissionById: jest.fn(),
} as unknown as jest.Mocked<UpdateRoleService>;

const mockGetRoleService = {
  getRole: jest.fn(),
} as unknown as jest.Mocked<GetRoleService>;

describe('UpdateRoleUseCase', () => {
  let useCase: UpdateRoleUseCase;

  beforeEach(() => {
    useCase = new UpdateRoleUseCase(mockUpdateService, mockGetRoleService);
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
    mockUpdateService.findPermissionById.mockResolvedValue(mockPermission);
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

  it('should throw RoleAlreadyExistsException if name is changed to an existing one', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockUpdateService.findByName.mockResolvedValue({ ...mockRole, id: 2, name: 'ExistingName' });

    await expect(useCase.execute(1, { ...updateInput, name: 'ExistingName' })).rejects.toThrow(
      RoleAlreadyExistsException
    );
  });

  it('should throw PermissionNotFoundException if some permission does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockUpdateService.findByName.mockResolvedValue(null);
    mockUpdateService.findPermissionById.mockResolvedValue(null);

    await expect(useCase.execute(1, updateInput)).rejects.toThrow(PermissionNotFoundException);
  });

  it('should not validate name if it is not changed', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockUpdateService.findPermissionById.mockResolvedValue(mockPermission);
    mockUpdateService.update.mockResolvedValue(mockRole);

    await useCase.execute(mockRole.id, { ...updateInput, name: mockRole.name });

    expect(mockUpdateService.findByName).not.toHaveBeenCalled();
  });
});
