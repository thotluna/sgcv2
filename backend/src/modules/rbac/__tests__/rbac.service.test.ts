// src/modules/rbac/__tests__/rbac.service.test.ts
import { rbacService } from '../rbac.service';

jest.mock('../../../config/prisma', () => {
  const mockUser = {
    id: 1,
    roles: [
      {
        role: {
          name: 'admin',
          permissions: [
            { permission: { resource: 'ODS', action: 'CREATE' } },
            { permission: { resource: 'ODS', action: 'READ' } },
          ],
        },
      },
      {
        role: {
          name: 'manager',
          permissions: [{ permission: { resource: 'REPORT', action: 'VIEW' } }],
        },
      },
    ],
  };
  return {
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue(mockUser),
      },
    },
  };
});

describe('RbacService', () => {
  it('should return unique permissions for a user', async () => {
    const perms = await rbacService.getUserPermissions(1);
    expect(perms).toEqual(
      expect.arrayContaining([
        { resource: 'ODS', action: 'CREATE' },
        { resource: 'ODS', action: 'READ' },
        { resource: 'REPORT', action: 'VIEW' },
      ])
    );
    // No duplicates
    const keys = perms.map(p => `${p.resource}.${p.action}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('should detect existing permission', async () => {
    const has = await rbacService.hasPermission(1, 'ODS', 'CREATE');
    expect(has).toBe(true);
  });

  it('should detect missing permission', async () => {
    const has = await rbacService.hasPermission(1, 'ODS', 'DELETE');
    expect(has).toBe(false);
  });

  it('should detect role presence', async () => {
    const hasRole = await rbacService.hasRole(1, 'admin');
    expect(hasRole).toBe(true);
  });

  it('should detect role absence', async () => {
    const hasRole = await rbacService.hasRole(1, 'superadmin');
    expect(hasRole).toBe(false);
  });
});
