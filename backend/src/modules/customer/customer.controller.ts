import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from '@sgcv2/shared';
import { ResponseHelper } from '../../shared/utils/response.helpers';
import { z } from 'zod';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@shared/exceptions';

const createCustomerDtoSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(5)
    .regex(/^[A-Z0-9]+$/, 'Invalid code'),
  businessName: z.string().min(3).max(50).optional(),
  legalName: z.string().min(3).max(100),
  taxId: z.string().regex(/^[VEPJG]-[0-9]{8}-[0-9]$/, 'Invalid tax id'),
  address: z.string().min(3).max(255),
  phone: z.string().min(10).max(15).optional(),
});

export function validateCreateCustomerDto(dto: CreateCustomerDto) {
  return createCustomerDtoSchema.safeParse(dto);
}

@injectable()
export class CustomerController {
  private customerService: CustomerService;

  constructor(@inject(TYPES.CustomerService) service: CustomerService) {
    this.customerService = service;
  }

  async create(req: Request, res: Response): Promise<Response> {
    const customerDto: CreateCustomerDto = req.body;

    const result = validateCreateCustomerDto(customerDto);

    if (!result.success) {
      const errors = result.error.issues.reduce((acc: Record<string, string>, err: z.ZodIssue) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});

      throw new UnprocessableEntityException('Validation failed', errors);
    }

    try {
      const customer = await this.customerService.create(result.data);
      return ResponseHelper.created(res, customer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Customer code already exists') {
          throw new ConflictException(error.message);
        }

        if (error.message === 'Customer tax id already exists') {
          throw new ConflictException(error.message);
        }
      }
      throw error;
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.perPage as string) || 10;
    const stateQuery = req.query.state as string | undefined;
    const searchQuery = req.query.search as string | undefined;
    let state: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | undefined = undefined;

    if (stateQuery === 'ACTIVE') state = 'ACTIVE';
    if (stateQuery === 'INACTIVE') state = 'INACTIVE';
    if (stateQuery === 'SUSPENDED') state = 'SUSPENDED';

    const result = await this.customerService.findAll(page, limit, {
      state,
      search: searchQuery,
    });

    return ResponseHelper.paginated(res, result.customers, {
      page: result.pagination.page,
      perPage: result.pagination.perPage,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const customer = await this.customerService.findById(id);
      return ResponseHelper.success(res, customer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Customer not found') {
          throw new NotFoundException(error.message);
        }
      }
      throw error;
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const customerDto: UpdateCustomerDto = req.body;
    try {
      const customer = await this.customerService.update(id, customerDto);
      return ResponseHelper.success(res, customer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Customer not found') {
          throw new NotFoundException(error.message);
        }
      }
      throw error;
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const customer = await this.customerService.delete(id);
      return ResponseHelper.success(res, customer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Customer not found') {
          throw new NotFoundException(error.message);
        }
      }
      throw error;
    }
  }
}
