// src/modules/rbac/rbac.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RbacService {
  /**
   * Retrieve all permissions assigned to a user (through its roles).
   * Returns an array of objects { modulo: string, accion: string }.
   */
  async getUserPermissions(userId: number) {
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      include: {
        usuario_rol: {
          include: {
            rol: {
              include: {
                rol_permiso: {
                  include: { permiso: true },
                },
              },
            },
          },
        },
      },
    });
    if (!user) return [];
    const permissions = user.usuario_rol.flatMap(
      ur =>
        ur.rol?.rol_permiso?.map((rp: any) => ({
          modulo: rp.permiso.modulo,
          accion: rp.permiso.accion,
        })) ?? []
    );
    // Remove duplicates
    return Array.from(new Set(permissions.map(p => `${p.modulo}.${p.accion}`))).map(key => {
      const [modulo, accion] = key.split('.');
      return { modulo, accion };
    });
  }

  /**
   * Check if a user has a specific permission.
   */
  async hasPermission(userId: number, module: string, action: string): Promise<boolean> {
    const perms = await this.getUserPermissions(userId);
    return perms.some(p => p.modulo === module && p.accion === action);
  }

  /**
   * Check if a user has at least one of the specified roles.
   */
  async hasRole(userId: number, ...roleNames: string[]): Promise<boolean> {
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      include: { usuario_rol: { include: { rol: true } } },
    });
    if (!user) return false;
    const userRoles = (user.usuario_rol as any[])
      .map(ur => ur.rol?.nombre)
      .filter(Boolean) as string[];
    return roleNames.some(r => userRoles.includes(r));
  }
}

export const rbacService = new RbacService();
