import 'reflect-metadata';
import { GetMeUserUseCaseService } from '../../application/get-me-user.use-case.service';
import { UsersService } from '@modules/users/domain/user.service';
import { UserNotFoundException } from '@users/domain/exceptions/user-no-found.exception';

describe('GetMeUserUseCaseService', () => {
  let service: GetMeUserUseCaseService;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    mockUsersService = {
      getUserWithRoles: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findByUsername: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    service = new GetMeUserUseCaseService(mockUsersService);
  });

  it('should return the user when found', async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      username: 'test',
      roles: [],
      isActive: true,
    };
    mockUsersService.getUserWithRoles.mockResolvedValue(mockUser as any);

    const result = await service.execute(userId);

    expect(result).toBe(mockUser);
    expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(userId);
  });

  it('should throw UserNotFoundException when user is not found', async () => {
    const userId = 1;
    mockUsersService.getUserWithRoles.mockResolvedValue(null);

    await expect(service.execute(userId)).rejects.toThrow(UserNotFoundException);
    expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(userId);
  });
});
