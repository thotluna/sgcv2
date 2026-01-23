import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@roles/di/types';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { RolesMapper } from '@roles/infrastructure/mappers/roles.mapper';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@shared/exceptions/http-exceptions';
import { CreateRoleDto } from '@sgcv2/shared';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { GetRoleUseCase } from '@roles/application/get-role.use-case';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { DeleteRoleUseCase } from '@roles/application/delete-role.use-case';
import { ListPermissionsUseCase } from '@roles/application/list-permissions.use-case';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { RoleInUseException } from '@roles/domain/exceptions/role-in-use-exception';
import { UpdateRoleDto } from '@sgcv2/shared';

@injectable()
export class RolesController {
  constructor(
    @inject(TYPES.CreateRoleUseCase) private readonly createRoleUseCase: CreateRoleUseCase,
    @inject(TYPES.ListRoleUseCase) private readonly getAllRolesUseCase: ListRolesUseCase,
    @inject(TYPES.GetRoleUseCase) private readonly getRoleUseCase: GetRoleUseCase,
    @inject(TYPES.UpdateRoleUseCase) private readonly updateRoleUseCase: UpdateRoleUseCase,
    @inject(TYPES.DeleteRoleUseCase) private readonly deleteRoleUseCase: DeleteRoleUseCase,
    @inject(TYPES.ListPermissionsUseCase)
    private readonly listPermissionsUseCase: ListPermissionsUseCase
  ) {}

  /**
   * @swagger
   * /roles:
   *   post:
   *     summary: Create a new role
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRoleDto'
   *     responses:
   *       201:
   *         description: Role created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/RoleWithPermissionsDto'
   *       400:
   *         description: Bad request (e.g. permission not found)
   *       409:
   *         description: Conflict (role name already exists)
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreateRoleDto = req.body;
      const input = RolesMapper.toCreateInput(dto);

      const role = await this.createRoleUseCase.execute(input);

      if (!role) {
        throw new BadRequestException('Role could not be created');
      }

      return ResponseHelper.success(res, RolesMapper.toWithPermissionsDto(role), 201);
    } catch (error) {
      if (error instanceof RoleAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof PermissionNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /roles:
   *   get:
   *     summary: List all roles (paginated)
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 10 }
   *     responses:
   *       200:
   *         description: Paginated role list
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
   *                         $ref: '#/components/schemas/RoleDto'
   *                     metadata:
   *                       $ref: '#/components/schemas/Pagination'
   */
  async getAll(req: Request, res: Response): Promise<Response> {
    const rawQuery: any = req.query;
    const filter = {
      search: rawQuery.search,
      page: rawQuery.page ? parseInt(rawQuery.page as string) : 1,
      limit: rawQuery.limit ? parseInt(rawQuery.limit as string) : 10,
    };

    const { items, total } = await this.getAllRolesUseCase.execute(filter);

    return ResponseHelper.paginated(
      res,
      items.map(r => RolesMapper.toDto(r)),
      {
        total,
        page: filter.page,
        perPage: filter.limit,
        totalPages: Math.ceil(total / filter.limit),
      }
    );
  }

  /**
   * @swagger
   * /roles/{id}:
   *   get:
   *     summary: Get role by ID
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Role details
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/RoleWithPermissionsDto'
   *       404:
   *         description: Role not found
   */
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const role = await this.getRoleUseCase.execute(id);
      return ResponseHelper.success(res, RolesMapper.toWithPermissionsDto(role));
    } catch (error) {
      if (error instanceof RoleNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /roles/{id}:
   *   patch:
   *     summary: Update role
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRoleDto'
   *     responses:
   *       200:
   *         description: Role updated
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/RoleWithPermissionsDto'
   *       404:
   *         description: Role not found
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateRoleDto = req.body;
      const input = RolesMapper.toUpdateInput(dto);

      const role = await this.updateRoleUseCase.execute(id, input);
      return ResponseHelper.success(res, RolesMapper.toWithPermissionsDto(role));
    } catch (error) {
      if (error instanceof RoleNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PermissionNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /roles/{id}:
   *   delete:
   *     summary: Delete role
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       204:
   *         description: Role deleted successfully
   *       400:
   *         description: Cannot delete role in use
   *       404:
   *         description: Role not found
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      await this.deleteRoleUseCase.execute(id);
      return ResponseHelper.success(res, null, 204);
    } catch (error) {
      if (error instanceof RoleNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof RoleInUseException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /roles/permissions:
   *   get:
   *     summary: List all available permissions
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of system permissions
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
   *                         $ref: '#/components/schemas/PermissionDto'
   */
  async getAllPermissions(_req: Request, res: Response): Promise<Response> {
    const permissions = await this.listPermissionsUseCase.execute();
    return ResponseHelper.success(
      res,
      permissions.map(p => ({
        id: p.id,
        resource: p.resource,
        action: p.action,
        description: p.description,
      }))
    );
  }
}
