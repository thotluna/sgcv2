import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CreateSubCustomerUseCase } from '@customer/application/create-subcustomer.use-case';
import { ListSubCustomersUseCase } from '@customer/application/list-subcustomers.use-case';
import { GetSubCustomerUseCase } from '@customer/application/get-subcustomer.use-case';
import { UpdateSubCustomerUseCase } from '@customer/application/update-subcustomer.use-case';
import { DeleteSubCustomerUseCase } from '@customer/application/delete-subcustomer.use-case';
import { SubCustomerMapper } from '@customer/infrastructure/mappers/subcustomer.mapper';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { ConflictException, NotFoundException } from '@shared/exceptions/http-exceptions';
import {
  CreateSubCustomerDto,
  UpdateSubCustomerDto,
  SubCustomerFilterSchemaType,
} from '@sgcv2/shared';

@injectable()
export class SubCustomerController {
  constructor(
    @inject(TYPES.CreateSubCustomerUseCase) private createUseCase: CreateSubCustomerUseCase,
    @inject(TYPES.ListSubCustomersUseCase) private listUseCase: ListSubCustomersUseCase,
    @inject(TYPES.GetSubCustomerUseCase) private getUseCase: GetSubCustomerUseCase,
    @inject(TYPES.UpdateSubCustomerUseCase) private updateUseCase: UpdateSubCustomerUseCase,
    @inject(TYPES.DeleteSubCustomerUseCase) private deleteUseCase: DeleteSubCustomerUseCase
  ) {}

  /**
   * @swagger
   * /customers/{customerId}/sub-customers:
   *   post:
   *     summary: Create a new sub-customer for a customer
   *     tags: [Sub-customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateSubCustomerDto'
   *     responses:
   *       201:
   *         description: Sub-customer created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/SubCustomerDto'
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const customerId = String(req.params.customerId);
      const dto: CreateSubCustomerDto = req.body;
      const input = SubCustomerMapper.toCreateInput(dto, customerId);
      const subCustomer = await this.createUseCase.execute(input);
      return ResponseHelper.success(res, SubCustomerMapper.toDto(subCustomer), 201);
    } catch (error) {
      if (error instanceof CustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SubCustomerAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /customers/{customerId}/sub-customers:
   *   get:
   *     summary: List all sub-customers for a customer
   *     tags: [Sub-customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema: { type: string, format: uuid }
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: perPage
   *         schema: { type: integer, default: 10 }
   *     responses:
   *       200:
   *         description: Paginated sub-customer list
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    const customerId = String(req.params.customerId);
    const query = req.query as unknown as SubCustomerFilterSchemaType;
    const { page = 1, perPage = 10, search } = query;

    const { items, total } = await this.listUseCase.execute(
      {
        search,
        page,
        limit: perPage,
      },
      customerId
    );

    return ResponseHelper.paginated(
      res,
      items.map(sc => SubCustomerMapper.toDto(sc)),
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
   * /sub-customers/{id}:
   *   get:
   *     summary: Get sub-customer by ID
   *     tags: [Sub-customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Sub-customer details
   */
  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const subCustomer = await this.getUseCase.execute(id);
      return ResponseHelper.success(res, SubCustomerMapper.toDto(subCustomer));
    } catch (error) {
      if (error instanceof SubCustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /sub-customers/{id}:
   *   put:
   *     summary: Update sub-customer
   *     tags: [Sub-customers]
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
   *             $ref: '#/components/schemas/UpdateSubCustomerDto'
   *     responses:
   *       200:
   *         description: Sub-customer updated
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const dto: UpdateSubCustomerDto = req.body;
      const input = SubCustomerMapper.toUpdateInput(dto);
      const subCustomer = await this.updateUseCase.execute(id, input);
      return ResponseHelper.success(res, SubCustomerMapper.toDto(subCustomer));
    } catch (error) {
      if (error instanceof SubCustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SubCustomerAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /sub-customers/{id}:
   *   delete:
   *     summary: Delete sub-customer
   *     tags: [Sub-customers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Sub-customer deleted
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const subCustomer = await this.deleteUseCase.execute(id);
      return ResponseHelper.success(res, SubCustomerMapper.toDto(subCustomer));
    } catch (error) {
      if (error instanceof SubCustomerNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
