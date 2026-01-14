import { UserRepository } from '@modules/users/domain/user-repository';
import { UserServiceImpl } from '@modules/users/infrastructure/http/user.service.impl';
import { mockUserWithRole } from '../../helpers';

const mockRepository = {
  getUserWithRoles: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
};


describe('UserServiceImpl', () => {
  let userServiceImpl: UserServiceImpl;

  beforeEach(() => {
    userServiceImpl = new UserServiceImpl(mockRepository as unknown as UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user with roles', async () => {
    mockRepository.getUserWithRoles.mockResolvedValue(mockUserWithRole);

    const result = await userServiceImpl.getUserWithRoles(1);

    expect(result).toEqual(mockUserWithRole);
  });

  it('should return null when user is not found', async () => {
    mockRepository.getUserWithRoles.mockResolvedValue(null);

    await expect(userServiceImpl.getUserWithRoles(1)).resolves.toBeNull();
    expect(mockRepository.getUserWithRoles).toHaveBeenCalledWith(1);
  });

  it('should update user and return updated entity with roles', async () => {
    const updateData = { firstName: 'Updated' };
    mockRepository.update.mockResolvedValue({ id: 1, ...updateData });
    mockRepository.getUserWithRoles.mockResolvedValue({ ...mockUserWithRole, ...updateData });

    const result = await userServiceImpl.updateUser(1, updateData as any);

    expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(mockRepository.getUserWithRoles).toHaveBeenCalledWith(1);
    expect(result.firstName).toBe('Updated');
  });

  it('should call repository.getAll with filters', async () => {
    const filters = { search: 'test' };
    const mockResult = { users: [], total: 0 };
    mockRepository.getAll.mockResolvedValue(mockResult);

    const result = await userServiceImpl.getAll(filters);

    expect(mockRepository.getAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockResult);
  });

  describe('create', () => {
    it('should call repository.create and return the entity', async () => {
      const createData = {
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'hashedpassword',
      };
      const mockCreatedUser = { id: 2, ...createData };
      mockRepository.create.mockResolvedValue(mockCreatedUser as any);

      const result = await userServiceImpl.create(createData as any);

      expect(mockRepository.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockCreatedUser);
    });
  });
});

