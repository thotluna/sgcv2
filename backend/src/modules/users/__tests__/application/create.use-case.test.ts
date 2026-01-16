import { PasswordHasher } from '@modules/auth/domain/password-hasher';
import { CreateUseCase } from '@modules/users/application/create.use-case';
import { UserRepository } from '@modules/users/domain/user-repository';

const mockUserRepository = {
  create: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;

const mockHasher = {
  hashPassword: jest.fn(),
} as unknown as jest.Mocked<PasswordHasher>;

describe('CreateUserUseCaseService', () => {
  let useCase: CreateUseCase;

  beforeEach(() => {
    useCase = new CreateUseCase(mockUserRepository, mockHasher);
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

    mockHasher.hashPassword.mockResolvedValue('hashedpassword');
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);

    const result = await useCase.execute(userInput);

    expect(mockHasher.hashPassword).toHaveBeenCalledWith('plainpassword');
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...userInput,
      password: 'hashedpassword',
    });
    expect(result).toEqual(mockCreatedUser);
  });
});
