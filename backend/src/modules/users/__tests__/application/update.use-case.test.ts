import { UpdateUseCase } from '../../application/update.use-case';
import { UpdateUserInput } from '../../domain/dtos/user.dtos';

import { UpdateUserService } from '@modules/users/domain/update.service';

describe('UpdateUserUseCaseService', () => {
  let service: UpdateUseCase;
  let userService: jest.Mocked<UpdateUserService>;
  let hasher: jest.Mocked<any>;

  beforeEach(() => {
    userService = {
      getUserWithRoles: jest.fn(),
      update: jest.fn(),
    } as any;
    hasher = {
      hashPassword: jest.fn(),
    } as any;
    service = new UpdateUseCase(userService, hasher);
    jest.clearAllMocks();
  });

  it('should call userService.update with hashed password if password is provided', async () => {
    const id = 1;
    const input: UpdateUserInput = {
      password: 'newpassword123',
    };
    const hashedPassword = 'hashed_password';
    userService.getUserWithRoles.mockResolvedValue({ id, passwordHash: 'old_hash' } as any);
    hasher.hashPassword.mockResolvedValue(hashedPassword);

    await service.execute(id, input);

    expect(hasher.hashPassword).toHaveBeenCalledWith('newpassword123');
    expect(userService.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        passwordHash: hashedPassword,
      })
    );
  });

  it('should call userService.update without password hashing if password is not provided', async () => {
    const id = 1;
    const input: UpdateUserInput = {
      firstName: 'John',
    };
    userService.getUserWithRoles.mockResolvedValue({ id, firstName: 'Old' } as any);

    await service.execute(id, input);

    expect(hasher.hashPassword).not.toHaveBeenCalled();
    expect(userService.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        firstName: 'John',
      })
    );
  });
});
