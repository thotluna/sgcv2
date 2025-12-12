import { UserNotFoundException } from '@modules/users/domain/exceptions/user-no-found.exception';
import { UserRepository } from '@modules/users/domain/user-repository';
import { UserServiceImpl } from '@modules/users/infrastructure/http/user.service.impl';

const mockRepository = {
  getUserWithRoles: jest.fn(),
};

jest.mock('@modules/users/domain/user-repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('UserServiceImpl', () => {
  let userServiceImpl: UserServiceImpl;

  beforeEach(() => {
    userServiceImpl = new UserServiceImpl(mockRepository as unknown as UserRepository);
  });

  it('should get user with roles', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'testpassword',
      roles: [],
    };
    mockRepository.getUserWithRoles.mockResolvedValue(user);

    const result = await userServiceImpl.getUserWithRoles(1);

    expect(result).toEqual(user);
  });

  it('should throw UserNotFoundException when user is not found', async () => {
    mockRepository.getUserWithRoles.mockResolvedValue(null);

    await expect(userServiceImpl.getUserWithRoles(1)).rejects.toThrow(UserNotFoundException);
    expect(mockRepository.getUserWithRoles).toHaveBeenCalledWith(1);
  });
});
