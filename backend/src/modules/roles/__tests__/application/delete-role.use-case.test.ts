import { mockRole } from '@roles/__tests__/helpers';
import { DeleteRoleUseCase } from '@roles/application/delete-role.use-case';
import { DeleteRoleService } from '@roles/domain/delete.role.service';
import { RoleInUseException } from '@roles/domain/exceptions/role-in-use-exception';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';

const mockDeleteService = {
  countUsersWithRole: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<DeleteRoleService>;

const mockGetRoleService = {
  getRole: jest.fn(),
} as unknown as jest.Mocked<GetRoleService>;

describe('DeleteRoleUseCase', () => {
  let useCase: DeleteRoleUseCase;

  beforeEach(() => {
    useCase = new DeleteRoleUseCase(mockDeleteService, mockGetRoleService);
    jest.clearAllMocks();
  });

  it('should delete a role successfully if it exists and not in use', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockDeleteService.countUsersWithRole.mockResolvedValue(0);
    mockDeleteService.delete.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(mockGetRoleService.getRole).toHaveBeenCalledWith(1);
    expect(mockDeleteService.countUsersWithRole).toHaveBeenCalledWith(1);
    expect(mockDeleteService.delete).toHaveBeenCalledWith(1);
  });

  it('should throw RoleNotFoundException if role does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(RoleNotFoundException);
    expect(mockDeleteService.delete).not.toHaveBeenCalled();
  });

  it('should throw RoleInUseException if role is assigned to users', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);
    mockDeleteService.countUsersWithRole.mockResolvedValue(5);

    await expect(useCase.execute(1)).rejects.toThrow(RoleInUseException);
    expect(mockDeleteService.delete).not.toHaveBeenCalled();
  });
});
