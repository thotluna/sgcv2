import { TYPES } from '@users/di/types';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { ShowMeUseCaseService } from '@users/application/show-me.use-case.service';
import { UsersMapper } from '../mappers/users';

@injectable()
export class UsersController {
  constructor(@inject(TYPES.ShowMeUseCaseService) private readonly useCase: ShowMeUseCaseService) {}

  async me(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const id = Number(user.id);

    try {
      const userWithRoles = await this.useCase.execute(id);

      if (!userWithRoles) {
        throw new NotFoundException('User not found');
      }

      console.log({ userWithRoles });

      return ResponseHelper.success(res, UsersMapper.toUserWithRolesDto(userWithRoles));
    } catch {
      throw new NotFoundException('User not found');
    }
  }
}
