// src/modules/rbac/rbac.service.ts
import { prisma } from '../../config/prisma';

export class RbacService {
  /**
   * Retrieve all permissions assigned to a user (through its roles).
   * Returns an array of objects { resource: string, action: string }.
   */
  async getUserPermissions(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
    if (!user) return [];
    const permissions = user.roles.flatMap(
      ur =>
        ur.role?.permissions?.map(rp => ({
          resource: rp.permission.resource,
          action: rp.permission.action,
        })) ?? []
    );
    // Remove duplicates
    return Array.from(new Set(permissions.map(p => `${p.resource}.${p.action}`))).map(
      (key: string) => {
        const [resource, action] = key.split('.');
        return { resource, action };
      }
    );
  }

  /**
   * Check if a user has a specific permission.
   */
  async hasPermission(userId: number, resource: string, action: string): Promise<boolean> {
    const perms = await this.getUserPermissions(userId);
    return perms.some(p => p.resource === resource && p.action === action);
  }

  /**
   * Check if a user has at least one of the specified roles.
   */
  async hasRole(userId: number, ...roleNames: string[]): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) return false;
    const userRoles = user.roles.map(ur => ur.role?.name).filter(Boolean) as string[];
    return roleNames.some(r => userRoles.includes(r));
  }
}

export const rbacService = new RbacService();
