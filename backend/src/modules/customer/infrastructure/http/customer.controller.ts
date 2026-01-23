import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CreateCustomerUseCase } from '@customer/application/create-customer.use-case';
import { ListCustomersUseCase } from '@customer/application/list-customers.use-case';
import { GetCustomerUseCase } from '@customer/application/get-customer.use-case';
import { UpdateCustomerUseCase } from '@customer/application/update-customer.use-case';
import { DeleteCustomerUseCase } from '@customer/application/delete-customer.use-case';
import { CustomerMapper } from '@customer/infrastructure/mappers/customer.mapper';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { CustomerAlreadyExistsException } from '@customer/domain/exceptions/customer-already-exists.exception';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { ConflictException, NotFoundException } from '@shared/exceptions/http-exceptions';
import { CreateCustomerDto, UpdateCustomerDto } from '@sgcv2/shared';
import { CustomerFilterSchemaType } from '@customer/infrastructure/http/customer-filter.schema';

@injectable()
export class CustomerController {
  constructor(
    @inject(TYPES.CreateCustomerUseCase) private createUseCase: CreateCustomerUseCase,
    @inject(TYPES.ListCustomersUseCase) private listUseCase: ListCustomersUseCase,
    @inject(TYPES.GetCustomerUseCase) private getUseCase: GetCustomerUseCase,
    @inject(TYPES.UpdateCustomerUseCase) private updateUseCase: UpdateCustomerUseCase,
    @inject(TYPES.DeleteCustomerUseCase) private deleteUseCase: DeleteCustomerUseCase
  ) { }

  /**
   * @swagger
   * /customers:
   *   post:
   *     summary: Create a new customer
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCustomerDto'
   *     responses:
   *       201:
   *         description: Customer created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CustomerDto'
   *       400:
   *         description: Bad request
   *       409:
   *         description: Conflict (Customer code or tax ID already exists)
   */
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

  /**
   * @swagger
   * /customers:
   *   get:
   *     summary: List all customers (paginated)
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *         description: Search by name, code or tax ID
   *       - in: query
   *         name: state
   *         schema: { type: string, enum: [ACTIVE, INACTIVE, BLOCKED] }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: perPage
   *         schema: { type: integer, default: 10 }
   *     responses:
   *       200:
   *         description: Paginated customer list
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/CustomerDto'
   *                     metadata:
   *                       $ref: '#/components/schemas/Pagination'
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    const query = req.query as CustomerFilterSchemaType;
    const { page = 1, perPage = 10, state, search } = query;

    const { items, total } = await this.listUseCase.execute({
      state,
      search,
      page,
      limit: perPage,
    });

    return ResponseHelper.paginated(
      res,
      items.map(c => CustomerMapper.toDto(c)),
      {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      }
    );
  }

  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     summary: Get customer by ID
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Customer details
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CustomerDto'
   *       404:
   *         description: Customer not found
   */
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

  /**
   * @swagger
   * /customers/{id}:
   *   put:
   *     summary: Update customer
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCustomerDto'
   *     responses:
   *       200:
   *         description: Customer updated
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CustomerDto'
   *       404:
   *         description: Customer not found
   *       409:
   *         description: Conflict (Customer code or tax ID already exists)
   */
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

  /**
   * @swagger
   * /customers/{id}:
   *   delete:
   *     summary: Delete customer
   *     tags: [Customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Customer deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CustomerDto'
   *       404:
   *         description: Customer not found
   */
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
