import { CreateUserUseCaseService } from '@modules/users/application/create-user.use-case.service';
import { UserRepository } from '@modules/users/domain/user-repository';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUserRepository = {
  create: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;

describe('CreateUserUseCaseService', () => {
  let useCase: CreateUserUseCaseService;

  beforeEach(() => {
    useCase = new CreateUserUseCaseService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with a hashed password', async () => {
    const userInput = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'plainpassword',
      firstName: 'New',
      lastName: 'User',
      isActive: 'ACTIVE' as const,
    };

    const mockCreatedUser = {
      id: 2,
      ...userInput,
      avatar: null,
      passwordHash: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE' as const,
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);

    const result = await useCase.execute(userInput);

    expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...userInput,
      password: 'hashedpassword',
    });
    expect(result).toEqual(mockCreatedUser);
  });
});
