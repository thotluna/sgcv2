import { GetUseCase } from '@modules/users/application/get.use-case';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user-no-found.exception';
import { ShowUserService } from '@modules/users/domain/show.service';
import { mockUserWithRole } from '../helpers';

const mockService = {
  getUserWithRoles: jest.fn(),
};

describe('GetUseCase', () => {
  let useCase: GetUseCase;

  beforeEach(() => {
    useCase = new GetUseCase(mockService as ShowUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user with roles', async () => {
    mockService.getUserWithRoles.mockResolvedValue(mockUserWithRole);

    const user = await useCase.execute(1);
    expect(user).toBeDefined();
    expect(mockService.getUserWithRoles).toHaveBeenCalledWith(1);
    expect(user).toEqual(mockUserWithRole);
  });

  it('should throw an error when user is not found', async () => {
    mockService.getUserWithRoles.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(UserNotFoundException);
  });
});
