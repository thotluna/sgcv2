import { prisma } from '@config/prisma';
import {
  CreateSubCustomerInput,
  PaginatedSubCustomers,
  SubCustomerFilterInput,
  UpdateSubCustomerInput,
} from '@customer/domain/inputs/subcustomer.input';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { SubCustomerRepository } from '@customer/domain/subcustomer.repository';
import { SubCustomerMapper } from '@customer/infrastructure/mappers/subcustomer.mapper';
import { Prisma } from '@prisma/client';
import { injectable } from 'inversify';

@injectable()
export class SubCustomerPrismaRepository implements SubCustomerRepository {
  async create(data: CreateSubCustomerInput): Promise<SubCustomerEntity> {
    const subCustomer = await prisma.subCustomer.create({
      data: {
        customerId: data.customerId,
        businessName: data.businessName,
        externalCode: data.externalCode,
      },
      include: { customer: true },
    });
    return SubCustomerMapper.toEntity(subCustomer);
  }

  async findAll(
    filters: SubCustomerFilterInput,
    customerId?: string
  ): Promise<PaginatedSubCustomers> {
    const { page = 1, limit = 10, search } = filters;
    const where: Prisma.SubCustomerWhereInput = {};

    if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { externalCode: { contains: search, mode: 'insensitive' } },
        {
          customer: {
            OR: [
              { legalName: { contains: search, mode: 'insensitive' } },
              { businessName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.subCustomer.findMany({
        where,
        include: { customer: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subCustomer.count({ where }),
    ]);

    return {
      items: items.map(item => SubCustomerMapper.toEntity(item)),
      total,
    };
  }

  async findById(id: string): Promise<SubCustomerEntity | null> {
    const subCustomer = await prisma.subCustomer.findUnique({
      where: { id },
      include: { customer: true },
    });
    return subCustomer ? SubCustomerMapper.toEntity(subCustomer) : null;
  }

  async findByExternalCode(
    customerId: string,
    externalCode: string
  ): Promise<SubCustomerEntity | null> {
    const subCustomer = await prisma.subCustomer.findUnique({
      where: {
        customerId_externalCode: {
          customerId,
          externalCode,
        },
      },
      include: { customer: true },
    });
    return subCustomer ? SubCustomerMapper.toEntity(subCustomer) : null;
  }

  async update(id: string, data: UpdateSubCustomerInput): Promise<SubCustomerEntity> {
    const subCustomer = await prisma.subCustomer.update({
      where: { id },
      data: {
        businessName: data.businessName,
        externalCode: data.externalCode,
      },
      include: { customer: true },
    });
    return SubCustomerMapper.toEntity(subCustomer);
  }

  async delete(id: string): Promise<SubCustomerEntity> {
    const subCustomer = await prisma.subCustomer.delete({
      where: { id },
      include: { customer: true },
    });
    return SubCustomerMapper.toEntity(subCustomer);
  }
}
