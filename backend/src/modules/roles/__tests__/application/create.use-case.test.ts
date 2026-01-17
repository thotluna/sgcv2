import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { CreateService } from '@roles/domain/create.service';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { mockRole, mockPermission } from '@roles/__tests__/helpers';

const mockCreateService = {
  findByName: jest.fn(),
  findPermissionById: jest.fn(),
  create: jest.fn(),
} as unknown as jest.Mocked<CreateService>;

describe('CreateRoleUseCase', () => {
  let useCase: CreateRoleUseCase;

  beforeEach(() => {
    useCase = new CreateRoleUseCase(mockCreateService);
    jest.clearAllMocks();
  });

  const createInput = {
    name: 'New Role',
    description: 'New role description',
    permissionIds: [1],
  };

  it('should create a role successfully', async () => {
    mockCreateService.findByName.mockResolvedValue(null);
    mockCreateService.findPermissionById.mockResolvedValue(mockPermission);
    mockCreateService.create.mockResolvedValue(mockRole);

    const result = await useCase.execute(createInput);

    expect(mockCreateService.findByName).toHaveBeenCalledWith(createInput.name);
    expect(mockCreateService.findPermissionById).toHaveBeenCalledWith(1);
    expect(mockCreateService.create).toHaveBeenCalledWith(createInput);
    expect(result).toEqual(mockRole);
  });

  it('should throw RoleAlreadyExistsException if role name already exists', async () => {
    mockCreateService.findByName.mockResolvedValue(mockRole);
    mockCreateService.findPermissionById.mockResolvedValue(mockPermission);

    await expect(useCase.execute(createInput)).rejects.toThrow(RoleAlreadyExistsException);

    expect(mockCreateService.create).not.toHaveBeenCalled();
  });

  it('should throw PermissionNotFoundException if some permission id does not exist', async () => {
    mockCreateService.findByName.mockResolvedValue(null);
    mockCreateService.findPermissionById.mockResolvedValue(null);

    await expect(useCase.execute(createInput)).rejects.toThrow(PermissionNotFoundException);

    expect(mockCreateService.create).not.toHaveBeenCalled();
  });

  it('should handle parallel validation of multiple permissions', async () => {
    const inputWithMultiple = {
      ...createInput,
      permissionIds: [1, 2],
    };

    mockCreateService.findByName.mockResolvedValue(null);
    mockCreateService.findPermissionById
      .mockResolvedValueOnce(mockPermission) // ID 1 found
      .mockResolvedValueOnce(null); // ID 2 not found

    await expect(useCase.execute(inputWithMultiple)).rejects.toThrow(PermissionNotFoundException);

    expect(mockCreateService.findPermissionById).toHaveBeenCalledTimes(2);
  });
});
