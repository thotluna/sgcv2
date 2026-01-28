import { prisma } from '@config/prisma';
import { RbacRepository } from '@modules/rbac/domain/rbac.repository';
import { injectable } from 'inversify';

interface PermissionResult {
  resource: string;
  action: string;
}

@injectable()
export class RbacPrismaRepository implements RbacRepository {
  async getUserPermissions(userId: number): Promise<PermissionResult[]> {
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

    const permissions: PermissionResult[] = user.roles.flatMap(
      ur =>
        ur.role?.permissions?.map(rp => ({
          resource: rp.permission.resource,
          action: rp.permission.action,
        })) ?? []
    );

    // Remove duplicates
    const uniqueKeys = new Set(permissions.map(p => `${p.resource}.${p.action}`));
    return Array.from(uniqueKeys).map(key => {
      const [resource, action] = key.split('.');
      return { resource, action };
    });
  }

  async hasRole(userId: number, roleNames: string[]): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) return false;

    const userRoles = user.roles.map(ur => ur.role?.name).filter((name): name is string => !!name);
    return roleNames.some(r => userRoles.includes(r));
  }
}
