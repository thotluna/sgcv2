import { TYPES } from '@modules/users/di/types';
import { UsersService } from '@modules/users/domain/user.service';
import { UserWithRolesDto } from '@sgcv2/shared';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

@injectable()
export class UsersController {
  constructor(@inject(TYPES.UsersService) private readonly usersService: UsersService) {}

  async me(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as UserWithRolesDto;

      if (!user) {
        return ResponseHelper.unauthorized(res);
      }

      const userWithRoles = await this.usersService.getUserWithRoles(user.id);

      if (!userWithRoles) {
        return ResponseHelper.notFound(res, 'User not found');
      }

      return ResponseHelper.success(res, userWithRoles);
    } catch (error) {
      console.error('Get current user error:', error);
      return ResponseHelper.internalError(res, 'An error occurred while fetching user data');
    }
  }
}
