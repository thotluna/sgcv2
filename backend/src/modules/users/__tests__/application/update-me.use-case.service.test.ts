import 'reflect-metadata';
import { UpdateMeUseCaseService } from '@modules/users/application/update-me.use-case.service';
import { UsersService } from '@modules/users/domain/user.service';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user-no-found.exception';
import { BadRequestException } from '@shared/exceptions';
import { mockUserWithRole } from '../helpers';

describe('UpdateMeUseCaseService', () => {
  let useCase: UpdateMeUseCaseService;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    mockUsersService = {
      getUserWithRoles: jest.fn(),
      updateUser: jest.fn(),
    } as any;

    mockHasher = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    useCase = new UpdateMeUseCaseService(mockUsersService, mockHasher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const userId = 1;

    it('should update user fields excluding password', async () => {
      const updateData = { email: 'new@example.com', firstName: 'New' };
      mockUsersService.getUserWithRoles.mockResolvedValue(mockUserWithRole);
      mockUsersService.updateUser.mockResolvedValue({ ...mockUserWithRole, ...updateData });

      const result = await useCase.execute(userId, updateData);

      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(userId);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockHasher.hashPassword).not.toHaveBeenCalled();
      expect(result.email).toBe(updateData.email);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      mockUsersService.getUserWithRoles.mockResolvedValue(null);

      await expect(useCase.execute(userId, { email: 'test@test.com' })).rejects.toThrow(
        UserNotFoundException
      );
    });

    it('should throw BadRequestException if password is provided without currentPassword', async () => {
      mockUsersService.getUserWithRoles.mockResolvedValue(mockUserWithRole);

      await expect(useCase.execute(userId, { password: 'newPassword123' })).rejects.toThrow(
        new BadRequestException('Current password is required to set a new password')
      );
    });

    it('should throw BadRequestException if currentPassword is incorrect', async () => {
      mockUsersService.getUserWithRoles.mockResolvedValue(mockUserWithRole);
      mockHasher.comparePassword.mockResolvedValue(false);

      await expect(
        useCase.execute(userId, {
          password: 'newPassword123',
          currentPassword: 'wrongPassword',
        })
      ).rejects.toThrow(new BadRequestException('Current password is incorrect'));

      expect(mockHasher.comparePassword).toHaveBeenCalledWith(
        'wrongPassword',
        mockUserWithRole.passwordHash
      );
    });

    it('should update password and hash it if currentPassword is correct', async () => {
      const newPassword = 'newPassword123';
      const currentPassword = 'currentPassword123';
      const newHash = 'new_hashed_password';

      mockUsersService.getUserWithRoles.mockResolvedValue(mockUserWithRole);
      mockHasher.comparePassword.mockResolvedValue(true);
      mockHasher.hashPassword.mockResolvedValue(newHash);
      mockUsersService.updateUser.mockResolvedValue({
        ...mockUserWithRole,
        passwordHash: newHash,
      });

      const result = await useCase.execute(userId, {
        password: newPassword,
        currentPassword,
      });

      expect(mockHasher.comparePassword).toHaveBeenCalledWith(
        currentPassword,
        mockUserWithRole.passwordHash
      );
      expect(mockHasher.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(userId, {
        passwordHash: newHash,
      });
      expect(result.passwordHash).toBe(newHash);
    });

    it('should clean up internal fields before calling repository', async () => {
      mockUsersService.getUserWithRoles.mockResolvedValue(mockUserWithRole);
      mockUsersService.updateUser.mockResolvedValue(mockUserWithRole);

      await useCase.execute(userId, { firstName: 'Test' });

      const callData = mockUsersService.updateUser.mock.calls[0][1];
      expect(callData).not.toHaveProperty('password');
      expect(callData).not.toHaveProperty('currentPassword');
    });
  });
});
