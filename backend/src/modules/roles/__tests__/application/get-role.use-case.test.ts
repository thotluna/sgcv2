import { mockRole } from '@roles/__tests__/helpers';
import { GetRoleUseCase } from '@roles/application/get-role.use-case';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';

const mockGetRoleService = {
  getRole: jest.fn(),
} as unknown as jest.Mocked<GetRoleService>;

describe('GetRoleUseCase', () => {
  let useCase: GetRoleUseCase;

  beforeEach(() => {
    useCase = new GetRoleUseCase(mockGetRoleService);
    jest.clearAllMocks();
  });

  it('should return a role if it exists', async () => {
    mockGetRoleService.getRole.mockResolvedValue(mockRole);

    const result = await useCase.execute(1);

    expect(mockGetRoleService.getRole).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockRole);
  });

  it('should throw RoleNotFoundException if role does not exist', async () => {
    mockGetRoleService.getRole.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(RoleNotFoundException);
  });
});
