import { UpdateUserUseCaseService } from '../../application/update-user.use-case.service';
import { UpdateUserInput } from '../../domain/dtos/user.dtos';
import bcrypt from 'bcrypt';
import { UpdateUserService } from '@modules/users/domain/update.service';

jest.mock('bcrypt');

describe('UpdateUserUseCaseService', () => {
  let service: UpdateUserUseCaseService;
  let userService: jest.Mocked<UpdateUserService>;

  beforeEach(() => {
    userService = {
      update: jest.fn(),
    } as any;
    service = new UpdateUserUseCaseService(userService);
    jest.clearAllMocks();
  });

  it('should call userService.update with hashed password if password is provided', async () => {
    const id = 1;
    const input: UpdateUserInput = {
      password: 'newpassword123',
    };
    const hashedPassword = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    await service.execute(id, input);

    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
    expect(userService.update).toHaveBeenCalledWith(id, {
      ...input,
      password: hashedPassword,
    });
  });

  it('should call userService.update without password hashing if password is not provided', async () => {
    const id = 1;
    const input: UpdateUserInput = {
      firstName: 'John',
    };

    await service.execute(id, input);

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(userService.update).toHaveBeenCalledWith(id, input);
  });
});
