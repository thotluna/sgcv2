// src/modules/rbac/__tests__/rbac.service.test.ts
import { rbacService } from '../rbac.service';

jest.mock('@prisma/client', () => {
  const mockUser = {
    id_usuario: 1,
    usuario_rol: [
      {
        rol: {
          nombre: 'Administrador',
          rol_permiso: [
            { permiso: { modulo: 'ODS', accion: 'CREAR' } },
            { permiso: { modulo: 'ODS', accion: 'LEER' } },
          ],
        },
      },
      {
        rol: {
          nombre: 'Gerente',
          rol_permiso: [{ permiso: { modulo: 'REPORT', accion: 'VER' } }],
        },
      },
    ],
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      usuario: {
        findUnique: jest.fn().mockResolvedValue(mockUser),
      },
    })),
  };
});

describe('RbacService', () => {
  it('should return unique permissions for a user', async () => {
    const perms = await rbacService.getUserPermissions(1);
    expect(perms).toEqual(
      expect.arrayContaining([
        { modulo: 'ODS', accion: 'CREAR' },
        { modulo: 'ODS', accion: 'LEER' },
        { modulo: 'REPORT', accion: 'VER' },
      ])
    );
    // No duplicates
    const keys = perms.map(p => `${p.modulo}.${p.accion}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('should detect existing permission', async () => {
    const has = await rbacService.hasPermission(1, 'ODS', 'CREAR');
    expect(has).toBe(true);
  });

  it('should detect missing permission', async () => {
    const has = await rbacService.hasPermission(1, 'ODS', 'ELIMINAR');
    expect(has).toBe(false);
  });

  it('should detect role presence', async () => {
    const hasRole = await rbacService.hasRole(1, 'Administrador');
    expect(hasRole).toBe(true);
  });

  it('should detect role absence', async () => {
    const hasRole = await rbacService.hasRole(1, 'SuperAdmin');
    expect(hasRole).toBe(false);
  });
});
