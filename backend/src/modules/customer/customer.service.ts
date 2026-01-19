import { Customer, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateCustomerDto, UpdateCustomerDto, Pagination, CustomerState } from '@sgcv2/shared';
import { injectable } from 'inversify';

export type CustomerDelete = Pick<Customer, 'id'>;

export interface CustomerService {
  create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
  findById(id: string): Promise<Customer>;
  findByCode(code: string): Promise<Customer>;
  findAll(
    page: number,
    limit: number,
    filters?: { state?: CustomerState; search?: string }
  ): Promise<{ customers: Customer[]; pagination: Pagination }>;
  update(id: string, data: UpdateCustomerDto): Promise<Customer>;
  delete(id: string): Promise<CustomerDelete>;
}

@injectable()
export class CustomerServiceImp implements CustomerService {
  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomerCode = await prisma.customer.findUnique({
      where: {
        code: createCustomerDto.code,
      },
    });

    if (existingCustomerCode) {
      throw new Error('Customer code already exists');
    }

    const existingCustomerTaxId = await prisma.customer.findUnique({
      where: {
        taxId: createCustomerDto.taxId,
      },
    });

    if (existingCustomerTaxId) {
      throw new Error('Customer tax id already exists');
    }

    const customer = await prisma.customer.create({
      data: {
        code: createCustomerDto.code,
        businessName: createCustomerDto.businessName,
        legalName: createCustomerDto.legalName,
        taxId: createCustomerDto.taxId,
        address: createCustomerDto.address,
        phone: createCustomerDto.phone,
        state: 'ACTIVE',
      },
      select: {
        id: true,
        code: true,
        businessName: true,
        legalName: true,
        taxId: true,
        address: true,
        phone: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return customer;
  }

  async findAll(page = 1, limit = 10, filters?: { state?: CustomerState; search?: string }) {
    const skip = (page - 1) * limit;
    const where: Prisma.CustomerWhereInput = {};

    if (filters?.state) {
      where.state = filters.state;
    }

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { legalName: { contains: filters.search, mode: 'insensitive' } },
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { taxId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          code: true,
          businessName: true,
          legalName: true,
          taxId: true,
          address: true,
          phone: true,
          state: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      customers,
      pagination: {
        page,
        perPage: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        businessName: true,
        legalName: true,
        taxId: true,
        address: true,
        phone: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  async findByCode(code: string) {
    const customer = await prisma.customer.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        businessName: true,
        legalName: true,
        taxId: true,
        address: true,
        phone: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...updateCustomerDto,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        code: true,
        businessName: true,
        legalName: true,
        taxId: true,
        address: true,
        phone: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedCustomer;
  }

  async delete(id: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Soft delete
    const deletedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        state: 'INACTIVE', // Or SUSPENDED, depending on business logic, usually INACTIVE for soft delete
        updatedAt: new Date(),
      },
      select: {
        id: true,
        state: true,
      },
    });

    return deletedCustomer;
  }
}
