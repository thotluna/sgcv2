import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { CreateCustomerUseCase } from '../../application/create-customer.use-case';
import { ListCustomersUseCase } from '../../application/list-customers.use-case';
import { GetCustomerUseCase } from '../../application/get-customer.use-case';
import { UpdateCustomerUseCase } from '../../application/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../application/delete-customer.use-case';
import { CustomerMapper } from '../mappers/customer.mapper';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { CustomerAlreadyExistsException } from '../../domain/exceptions/customer-already-exists.exception';
import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';
import { ConflictException, NotFoundException } from '@shared/exceptions/http-exceptions';
import { CreateCustomerDto, UpdateCustomerDto } from '@sgcv2/shared';

@injectable()
export class CustomerController {
  constructor(
    @inject(TYPES.CreateCustomerUseCase) private createUseCase: CreateCustomerUseCase,
    @inject(TYPES.ListCustomersUseCase) private listUseCase: ListCustomersUseCase,
    @inject(TYPES.GetCustomerUseCase) private getUseCase: GetCustomerUseCase,
    @inject(TYPES.UpdateCustomerUseCase) private updateUseCase: UpdateCustomerUseCase,
    @inject(TYPES.DeleteCustomerUseCase) private deleteUseCase: DeleteCustomerUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreateCustomerDto = req.body;
      const input = CustomerMapper.toCreateInput(dto);
      const customer = await this.createUseCase.execute(input);
      return ResponseHelper.success(res, CustomerMapper.toDto(customer), 201);
    } catch (error) {
      if (error instanceof CustomerAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const rawQuery: any = req.query;
    const filter = {
      state: rawQuery.state,
      search: rawQuery.search,
      page: rawQuery.page ? parseInt(rawQuery.page) : 1,
      limit: rawQuery.perPage ? parseInt(rawQuery.perPage) : 10,
    };

    const { items, total } = await this.listUseCase.execute(filter);

    return ResponseHelper.paginated(
      res,
      items.map(c => CustomerMapper.toDto(c)),
      {
        total,
        page: filter.page,
        perPage: filter.limit,
        totalPages: Math.ceil(total / filter.limit),
      }
    );
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customer = await this.getUseCase.execute(id);
      return ResponseHelper.success(res, CustomerMapper.toDto(customer));
    } catch (error) {
      if (error instanceof CustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const dto: UpdateCustomerDto = req.body;
      const input = CustomerMapper.toUpdateInput(dto);
      const customer = await this.updateUseCase.execute(id, input);
      return ResponseHelper.success(res, CustomerMapper.toDto(customer));
    } catch (error) {
      if (error instanceof CustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof CustomerAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customer = await this.deleteUseCase.execute(id);
      return ResponseHelper.success(res, CustomerMapper.toDto(customer));
    } catch (error) {
      if (error instanceof CustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
