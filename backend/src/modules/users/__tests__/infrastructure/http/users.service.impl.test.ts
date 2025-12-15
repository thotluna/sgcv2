import { UserRepository } from '@modules/users/domain/user-repository';
import { UserServiceImpl } from '@modules/users/infrastructure/http/user.service.impl';
import { mockUserWithRole } from '../../helpers';

const mockRepository = {
  getUserWithRoles: jest.fn(),
};

describe('UserServiceImpl', () => {
  let userServiceImpl: UserServiceImpl;

  beforeEach(() => {
    userServiceImpl = new UserServiceImpl(mockRepository as unknown as UserRepository);
  });

  it('should get user with roles', async () => {
    mockRepository.getUserWithRoles.mockResolvedValue(mockUserWithRole);

    const result = await userServiceImpl.getUserWithRoles(1);

    expect(result).toEqual(mockUserWithRole);
  });

  it('should throw UserNotFoundException when user is not found', async () => {
    mockRepository.getUserWithRoles.mockResolvedValue(null);

    await expect(userServiceImpl.getUserWithRoles(1)).resolves.toBeNull();
    expect(mockRepository.getUserWithRoles).toHaveBeenCalledWith(1);
  });
});
