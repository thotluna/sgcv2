import { TYPES } from '@modules/users/di/types';
import { UsersService } from '@modules/users/domain/user.service';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';

@injectable()
export class UsersController {
  constructor(@inject(TYPES.UsersService) private readonly usersService: UsersService) {}

  async me(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const id = Number(user.id);

    const userWithRoles = await this.usersService.getUserWithRoles(id);

    if (!userWithRoles) {
      throw new NotFoundException('User not found');
    }

    return ResponseHelper.success(res, userWithRoles);
  }
}
