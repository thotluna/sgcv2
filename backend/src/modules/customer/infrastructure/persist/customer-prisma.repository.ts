import { prisma } from '@config/prisma';
import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import { CustomerRepository } from '@customer/domain/customer.repository';
import {
  CreateCustomerInput,
  CustomerFilterInput,
  PaginatedCustomers,
  UpdateCustomerInput,
} from '@customer/domain/inputs/customer.input';
import { Customer, CustomerState as PrismaCustomerState, Prisma } from '@prisma/client';
import { injectable } from 'inversify';

@injectable()
export class CustomerPrismaRepository implements CustomerRepository {
  async create(data: CreateCustomerInput): Promise<CustomerEntity> {
    const customer = await prisma.customer.create({
      data: {
        code: data.code,
        legalName: data.legalName,
        taxId: data.taxId,
        address: data.address,
        businessName: data.businessName,
        phone: data.phone,
        state: 'ACTIVE',
      },
    });
    return this.mapToEntity(customer);
  }

  async findAll(filters: CustomerFilterInput): Promise<PaginatedCustomers> {
    const { page = 1, limit = 10, state, search } = filters;
    const where: Prisma.CustomerWhereInput = {};

    if (state) {
      where.state = state as PrismaCustomerState;
    }

    if (search) {
      where.OR = [
        { legalName: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      items: items.map(item => this.mapToEntity(item)),
      total,
    };
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    return customer ? this.mapToEntity(customer) : null;
  }

  async findByCode(code: string): Promise<CustomerEntity | null> {
    const customer = await prisma.customer.findUnique({
      where: { code },
    });
    return customer ? this.mapToEntity(customer) : null;
  }

  async findByTaxId(taxId: string): Promise<CustomerEntity | null> {
    const customer = await prisma.customer.findUnique({
      where: { taxId },
    });
    return customer ? this.mapToEntity(customer) : null;
  }

  async update(id: string, data: UpdateCustomerInput): Promise<CustomerEntity> {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        legalName: data.legalName,
        taxId: data.taxId,
        address: data.address,
        businessName: data.businessName,
        phone: data.phone,
        state: data.state as PrismaCustomerState,
      },
    });
    return this.mapToEntity(customer);
  }

  async delete(id: string): Promise<CustomerEntity> {
    const customer = await prisma.customer.update({
      where: { id },
      data: { state: 'INACTIVE' },
    });
    return this.mapToEntity(customer);
  }

  private mapToEntity(model: Customer): CustomerEntity {
    return {
      id: model.id,
      code: model.code,
      businessName: model.businessName,
      legalName: model.legalName,
      taxId: model.taxId,
      address: model.address,
      phone: model.phone,
      state: model.state as unknown as CustomerState,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
