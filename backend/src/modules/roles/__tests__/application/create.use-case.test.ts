import { PermissionNotFoundException } from '@permissions/domain/exceptions/permission-not-found-exception';
import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { mockPermission, mockRole } from '@roles/__tests__/helpers';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { CreateService } from '@roles/domain/create.service';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';

const mockCreateService = {
  findByName: jest.fn(),
  create: jest.fn(),
} as unknown as jest.Mocked<CreateService>;

const mockGetPermissionsService = {
  findPermissionById: jest.fn(),
} as unknown as jest.Mocked<GetPermissions>;

describe('CreateRoleUseCase', () => {
  let useCase: CreateRoleUseCase;

  beforeEach(() => {
    useCase = new CreateRoleUseCase(mockCreateService, mockGetPermissionsService);
    jest.clearAllMocks();
  });

  const createInput = {
    name: 'New Role',
    description: 'New role description',
    permissionIds: [1],
  };

  it('should create a role successfully', async () => {
    mockCreateService.findByName.mockResolvedValue(null);
    mockGetPermissionsService.findPermissionById.mockResolvedValue(mockPermission);
    mockCreateService.create.mockResolvedValue(mockRole);

    const result = await useCase.execute(createInput);

    expect(mockCreateService.findByName).toHaveBeenCalledWith(createInput.name);
    expect(mockGetPermissionsService.findPermissionById).toHaveBeenCalledWith(1);
    expect(mockCreateService.create).toHaveBeenCalledWith(createInput);
    expect(result).toEqual(mockRole);
  });

  it('should throw RoleAlreadyExistsException if role name already exists', async () => {
    mockCreateService.findByName.mockResolvedValue(mockRole);

    await expect(useCase.execute(createInput)).rejects.toThrow(RoleAlreadyExistsException);

    expect(mockCreateService.create).not.toHaveBeenCalled();
  });

  it('should throw PermissionNotFoundException if some permission id does not exist', async () => {
    mockCreateService.findByName.mockResolvedValue(null);
    mockGetPermissionsService.findPermissionById.mockResolvedValue(null);

    await expect(useCase.execute(createInput)).rejects.toThrow(PermissionNotFoundException);

    expect(mockCreateService.create).not.toHaveBeenCalled();
  });
});
