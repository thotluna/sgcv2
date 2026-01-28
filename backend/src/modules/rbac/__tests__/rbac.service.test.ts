// src/modules/rbac/__tests__/rbac.service.test.ts
import { RbacRepository } from '../domain/rbac.repository';
import { RbacService } from '../rbac.service';

describe('RbacService', () => {
  let rbacService: RbacService;
  let mockRbacRepository: jest.Mocked<RbacRepository>;

  const mockPermissions = [
    { resource: 'ODS', action: 'CREATE' },
    { resource: 'ODS', action: 'READ' },
    { resource: 'REPORT', action: 'VIEW' },
  ];

  beforeEach(() => {
    mockRbacRepository = {
      getUserPermissions: jest.fn().mockResolvedValue(mockPermissions),
      hasRole: jest.fn().mockImplementation((_userId, roleNames) => {
        const userRoles = ['admin', 'manager'];
        return Promise.resolve(roleNames.some((r: string) => userRoles.includes(r)));
      }),
    };
    rbacService = new RbacService(mockRbacRepository);
  });

  it('should return unique permissions for a user', async () => {
    const perms = await rbacService.getUserPermissions(1);
    expect(perms).toEqual(
      expect.arrayContaining([
        { resource: 'ODS', action: 'CREATE' },
        { resource: 'ODS', action: 'READ' },
        { resource: 'REPORT', action: 'VIEW' },
      ])
    );
    // No duplicates (though mock already provides unique)
    const keys = perms.map(
      (p: { resource: string; action: string }) => `${p.resource}.${p.action}`
    );
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
