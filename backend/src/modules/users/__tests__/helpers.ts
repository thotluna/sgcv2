import { UserWithRolesEntity } from '../domain/user-entity';

export const mockUserWithRole: UserWithRolesEntity = {
  id: 1,
  username: 'test',
  email: 'test',
  passwordHash: 'test',
  firstName: 'test',
  lastName: 'test',
  avatar: null,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  roles: [
    {
      id: 1,
      name: 'test',
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [
        {
          id: 1,
          action: 'test',
          resource: 'test',
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ],
};
