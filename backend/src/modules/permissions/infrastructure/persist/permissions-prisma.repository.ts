import { prisma } from '@config/prisma';
import { PermissionFilterInput } from '@permissions/domain/inputs/permission.input';
import { PermissionRepository } from '@permissions/domain/permission.repository';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { PermissionEntityModelMapper } from '@permissions/infrastructure/persist/permission-entity-model.mapper';
import { Prisma } from '@prisma/client';
import { injectable } from 'inversify';

@injectable()
export class PermissionsPrismaRepository implements PermissionRepository {
  async getAll(filter?: PermissionFilterInput): Promise<PermissionEntity[]> {
    const { search, page, limit, sortBy, sortOrder } = filter || {};

    const orderBy:
      | Prisma.PermissionOrderByWithRelationInput
      | Prisma.PermissionOrderByWithRelationInput[] = sortBy
      ? { [sortBy]: sortOrder || 'asc' }
      : [{ resource: 'asc' }, { action: 'asc' }];

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
      orderBy,
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
