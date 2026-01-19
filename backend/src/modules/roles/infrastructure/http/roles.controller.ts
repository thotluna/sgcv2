import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@roles/di/types';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { RolesMapper } from '@roles/infrastructure/mappers/roles.mapper';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { BadRequestException, ConflictException } from '@shared/exceptions/http-exceptions';
import { CreateRoleDto } from '@sgcv2/shared';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';

@injectable()
export class RolesController {
  constructor(
    @inject(TYPES.CreateRoleUseCase) private readonly createRoleUseCase: CreateRoleUseCase,
    @inject(TYPES.ListRoleUseCase) private readonly getAllRolesUseCase: ListRolesUseCase
  ) {}

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
}
