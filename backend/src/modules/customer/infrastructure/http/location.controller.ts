import { CreateLocationUseCase } from '@customer/application/create-location.use-case';
import { DeleteLocationUseCase } from '@customer/application/delete-location.use-case';
import { GetLocationUseCase } from '@customer/application/get-location.use-case';
import { ListLocationsUseCase } from '@customer/application/list-locations.use-case';
import { UpdateLocationUseCase } from '@customer/application/update-location.use-case';
import { TYPES } from '@customer/di/types';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { LocationMapper } from '@customer/infrastructure/mappers/location.mapper';
import { NotFoundException } from '@shared/exceptions/http-exceptions';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import {
  CreateCustomerLocationDto,
  CustomerLocationFilterSchemaType,
  UpdateCustomerLocationDto,
} from '@sgcv2/shared';

@injectable()
export class LocationController {
  constructor(
    @inject(TYPES.CreateLocationUseCase) private createUseCase: CreateLocationUseCase,
    @inject(TYPES.UpdateLocationUseCase) private updateUseCase: UpdateLocationUseCase,
    @inject(TYPES.DeleteLocationUseCase) private deleteUseCase: DeleteLocationUseCase,
    @inject(TYPES.GetLocationUseCase) private getUseCase: GetLocationUseCase,
    @inject(TYPES.ListLocationsUseCase) private listUseCase: ListLocationsUseCase
  ) {}

  /**
   * @swagger
   * /customers/{customerId}/locations:
   *   post:
   *     summary: Create a new location for a customer
   *     tags: [Locations]
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
   *             $ref: '#/components/schemas/CreateCustomerLocationDto'
   *     responses:
   *       201:
   *         description: Location created successfully
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const customerId = String(req.params.customerId);
      const dto: CreateCustomerLocationDto = req.body;
      const input = LocationMapper.toCreateInput(dto, customerId);
      const location = await this.createUseCase.execute(input);
      return ResponseHelper.success(res, LocationMapper.toDto(location), 201);
    } catch (error: unknown) {
      if (
        error instanceof CustomerNotFoundException ||
        error instanceof SubCustomerNotFoundException
      ) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /customers/{customerId}/locations:
   *   get:
   *     summary: List all locations for a customer
   *     tags: [Locations]
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
   *         description: Paginated location list
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    const customerId = String(req.params.customerId);
    const query = req.query as unknown as CustomerLocationFilterSchemaType;
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
      items.map(l => LocationMapper.toDto(l)),
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
   * /locations/{id}:
   *   get:
   *     summary: Get location by ID
   *     tags: [Locations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Location details
   */
  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const location = await this.getUseCase.execute(id);
      return ResponseHelper.success(res, LocationMapper.toDto(location));
    } catch (error: unknown) {
      if (error instanceof LocationNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /locations/{id}:
   *   put:
   *     summary: Update location
   *     tags: [Locations]
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
   *             $ref: '#/components/schemas/UpdateCustomerLocationDto'
   *     responses:
   *       200:
   *         description: Location updated
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const dto: UpdateCustomerLocationDto = req.body;
      const input = LocationMapper.toUpdateInput(dto);
      const location = await this.updateUseCase.execute(id, input);
      return ResponseHelper.success(res, LocationMapper.toDto(location));
    } catch (error: unknown) {
      if (error instanceof LocationNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /locations/{id}:
   *   delete:
   *     summary: Delete location
   *     tags: [Locations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Location deleted
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const location = await this.deleteUseCase.execute(id);
      return ResponseHelper.success(res, LocationMapper.toDto(location));
    } catch (error: unknown) {
      if (error instanceof LocationNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
