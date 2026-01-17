import { UsersMapper } from '@users/infrastructure/mappers/users';
import { UserEntity } from '@users/domain/user-entity';
import { UserWithRolesModel } from '@users/infrastructure/persist/include';

describe('UsersMapper', () => {
  const mockDate = new Date();

  const userEntity: UserEntity = {
    id: 1,
    username: 'testuser',
    passwordHash: 'hashedpassword',
    email: 'test@example.com',
    firstName: 'First',
    lastName: 'Last',
    avatar: null,
    status: 'ACTIVE',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  // We cast to any to avoid struggling with deep Prisma type compatibility
  const userWithRolesModel: any = {
    id: 1,
    username: 'testuser',
    passwordHash: 'hashedpassword',
    email: 'test@example.com',
    firstName: 'First',
    lastName: 'Last',
    avatar: null,
    status: 'ACTIVE',
    createdAt: mockDate,
    updatedAt: mockDate,
    roles: [
      {
        roleId: 1,
        userId: 1,
        role: {
          id: 1,
          name: 'ADMIN',
          description: 'Admin role',
          permissions: [
            {
              permission: {
                resource: 'users',
                action: 'read',
              },
            },
          ],
        },
      },
    ],
  };

  describe('toUserDto', () => {
    it('should map UserEntity to UserDto correctly', () => {
      const result = UsersMapper.toUserDto(userEntity);

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        status: 'ACTIVE',
        createdAt: mockDate,
        updatedAt: mockDate,
        firstName: 'First',
        lastName: 'Last',
      });
    });
  });

  describe('toUserWithRolesDto', () => {
    it('should map UserWithRolesEntity to UserWithRolesDto correctly', () => {
      const userWithRolesEntity: any = {
        ...userEntity,
        roles: [
          {
            id: 1,
            name: 'ADMIN',
            description: 'Admin role',
            permissions: [
              {
                id: 1,
                resource: 'users',
                action: 'read',
              },
            ],
          },
        ],
        permissions: ['users.read'],
      };

      const result = UsersMapper.toUserWithRolesDto(userWithRolesEntity);

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        status: 'ACTIVE',
        createdAt: mockDate,
        updatedAt: mockDate,
        firstName: 'First',
        lastName: 'Last',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
            description: 'Admin role',
          },
        ],
        permissions: ['users.read'],
      });
    });
  });

  describe('toAuthenticatedUserDto', () => {
    it('should map UserWithRolesModel to AuthenticatedUserDto', () => {
      const result = UsersMapper.toAuthenticatedUserDto(userWithRolesModel as UserWithRolesModel);

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'First',
        lastName: 'Last',
        status: 'ACTIVE',
        roles: ['ADMIN'],
        permissions: ['users.read'],
      });
    });

    it('should default status to ACTIVE if status is null (edge case)', () => {
      const partialUser = { ...userWithRolesModel, status: null };
      const result = UsersMapper.toAuthenticatedUserDto(partialUser);
      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('toAuthUser', () => {
    it('should map UserWithRolesModel to AuthUser', () => {
      const result = UsersMapper.toAuthUser(userWithRolesModel as UserWithRolesModel);

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'test@example.com',
        firstName: 'First',
        lastName: 'Last',
        status: 'ACTIVE',
        roles: ['ADMIN'],
        permissions: ['users.read'],
      });
    });

    it('should default status to ACTIVE if status is null (edge case)', () => {
      const partialUser = { ...userWithRolesModel, status: null };
      const result = UsersMapper.toAuthUser(partialUser);
      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('toCreateUserInput', () => {
    it('should map CreateUserDto to CreateUserInput correctly', () => {
      const dto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        status: 'ACTIVE' as const,
      };

      const result = UsersMapper.toCreateUserInput(dto);

      expect(result).toEqual({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        avatar: undefined,
        status: 'ACTIVE',
      });
    });
  });
});
