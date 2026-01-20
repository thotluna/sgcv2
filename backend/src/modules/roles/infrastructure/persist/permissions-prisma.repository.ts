import { prisma } from '@config/prisma';
import { PermissionFilterInput } from '@roles/domain/inputs/permission.input';
import { PermissionRepository } from '@roles/domain/permission.repository';
import { PermissionEntity } from '@roles/domain/roles.entity';
import { injectable } from 'inversify';
import { RoleEntityModelMapper } from '@roles/infrastructure/persist/role-entity-model.mapper';

@injectable()
export class PermissionsPrismaRepository implements PermissionRepository {
  async getAll(filter?: PermissionFilterInput): Promise<PermissionEntity[]> {
    const { search, page, limit } = filter || {};

    const permissions = await prisma.permission.findMany({
      where: search
        ? {
            OR: [
              { resource: { contains: search, mode: 'insensitive' } },
              { action: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });

    return permissions.map(p => RoleEntityModelMapper.toPermissionEntity(p));
  }

  async findById(id: number): Promise<PermissionEntity | null> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    return permission ? RoleEntityModelMapper.toPermissionEntity(permission) : null;
  }
}
