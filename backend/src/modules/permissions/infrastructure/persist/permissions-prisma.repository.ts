import { prisma } from '@config/prisma';
import { PermissionFilterInput } from '@permissions/domain/inputs/permission.input';
import { PermissionRepository } from '@permissions/domain/permission.repository';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { PermissionEntityModelMapper } from '@permissions/infrastructure/persist/permission-entity-model.mapper';
import { injectable } from 'inversify';

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

    return permissions.map(p => PermissionEntityModelMapper.toPermissionEntity(p));
  }

  async findById(id: number): Promise<PermissionEntity | null> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    return permission ? PermissionEntityModelMapper.toPermissionEntity(permission) : null;
  }
}
