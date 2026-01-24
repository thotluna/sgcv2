import { Prisma } from '@prisma/client';
import { prisma } from '@config/prisma';
import { injectable } from 'inversify';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { LocationRepository } from '@customer/domain/location.repository';
import {
  CreateLocationInput,
  UpdateLocationInput,
  LocationFilterInput,
  PaginatedLocations,
} from '@customer/domain/inputs/location.input';
import { LocationMapper } from '@customer/infrastructure/mappers/location.mapper';

@injectable()
export class LocationPrismaRepository implements LocationRepository {
  async create(data: CreateLocationInput): Promise<CustomerLocationEntity> {
    const location = await prisma.customerLocation.create({
      data: {
        customerId: data.customerId,
        subCustomerId: data.subCustomerId,
        name: data.name,
        address: data.address,
      },
    });
    return LocationMapper.toEntity(location);
  }

  async findAll(filters: LocationFilterInput, customerId?: string): Promise<PaginatedLocations> {
    const { page = 1, limit = 10, search } = filters;
    const where: Prisma.CustomerLocationWhereInput = {};

    if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.customerLocation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customerLocation.count({ where }),
    ]);

    return {
      items: items.map(item => LocationMapper.toEntity(item)),
      total,
    };
  }

  async findById(id: string): Promise<CustomerLocationEntity | null> {
    const location = await prisma.customerLocation.findUnique({
      where: { id },
    });
    return location ? LocationMapper.toEntity(location) : null;
  }

  async update(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity> {
    const location = await prisma.customerLocation.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
      },
    });
    return LocationMapper.toEntity(location);
  }

  async delete(id: string): Promise<CustomerLocationEntity> {
    const location = await prisma.customerLocation.delete({
      where: { id },
    });
    return LocationMapper.toEntity(location);
  }
}
