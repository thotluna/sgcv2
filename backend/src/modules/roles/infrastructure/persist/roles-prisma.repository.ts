import { prisma } from '@config/prisma';
import {
  RoleFilterInput,
  PaginatedRoles,
  CreateRoleInput,
  UpdateRoleInput,
} from '@roles/domain/inputs/roles.input';
import { RoleRepository } from '@roles/domain/role.repository';
import { RoleEntity } from '@roles/domain/roles.entity';
import { injectable } from 'inversify';
import { RoleEntityModelMapper } from '@roles/infrastructure/persist/role-entity-model.mapper';
import { roleInclude } from '@roles/infrastructure/persist/include';

@injectable()
export class RolesPrismaRepository implements RoleRepository {
  async getAll(filter: RoleFilterInput): Promise<PaginatedRoles> {
    const { search, page, limit } = filter;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip: page && limit ? (page - 1) * limit : undefined,
        take: limit,
        include: roleInclude,
        orderBy: { name: 'asc' },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      roles: roles.map(r => RoleEntityModelMapper.toRoleWithPermissionsEntity(r)),
      total,
    };
  }

  async findById(id: number): Promise<RoleEntity | null> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    });

    return role ? RoleEntityModelMapper.toRoleWithPermissionsEntity(role) : null;
  }

  async findByIdWithPermissions(id: number): Promise<RoleEntity | null> {
    return this.findById(id);
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const role = await prisma.role.findUnique({
      where: { name },
      include: roleInclude,
    });

    return role ? RoleEntityModelMapper.toRoleWithPermissionsEntity(role) : null;
  }

  async create(data: CreateRoleInput): Promise<RoleEntity> {
    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          create: data.permissionIds.map(id => ({
            permissionId: id,
          })),
        },
      },
      include: roleInclude,
    });

    return RoleEntityModelMapper.toRoleWithPermissionsEntity(role);
  }

  async update(id: number, data: UpdateRoleInput): Promise<RoleEntity> {
    const updateData: any = {
      name: data.name,
      description: data.description,
    };

    if (data.permissionIds) {
      updateData.permissions = {
        deleteMany: {},
        create: data.permissionIds.map(pid => ({
          permissionId: pid,
        })),
      };
    }

    const role = await prisma.role.update({
      where: { id },
      data: updateData,
      include: roleInclude,
    });

    return RoleEntityModelMapper.toRoleWithPermissionsEntity(role);
  }

  async delete(id: number): Promise<void> {
    await prisma.role.delete({
      where: { id },
    });
  }

  async addPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          create: permissionIds.map(id => ({
            permissionId: id,
          })),
        },
      },
    });
  }

  async removePermissions(roleId: number, permissionIds: number[]): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });
  }

  async countUsersWithRole(roleId: number): Promise<number> {
    return await prisma.userRole.count({
      where: { roleId },
    });
  }
}
