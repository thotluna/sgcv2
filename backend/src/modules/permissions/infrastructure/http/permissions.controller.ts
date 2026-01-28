import { ListPermissionsUseCase } from '@permissions/application/list-permissions.use-case';
import { TYPES } from '@permissions/di/types';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class PermissionsController {
  constructor(
    @inject(TYPES.ListPermissionsUseCase)
    private readonly listPermissionsUseCase: ListPermissionsUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<Response> {
    const rawQuery = req.query as Record<string, string | undefined>;
    const filter = {
      search: rawQuery.search,
      page: rawQuery.page ? parseInt(rawQuery.page) : 1,
      limit: rawQuery.limit ? parseInt(rawQuery.limit) : 10,
    };

    const permissions = await this.listPermissionsUseCase.execute(filter);

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
