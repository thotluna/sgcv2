import { TYPES } from '@users/di/types';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { ShowMeUseCaseService } from '@users/application/show-me.use-case.service';
import { UpdateMeUseCaseService } from '@users/application/update-me.use-case.service';
import { UsersMapper } from '../mappers/users';
import { UpdateUserDto } from '@sgcv2/shared';
import { UpdateMeInput } from '@modules/users/domain/dtos/user.dtos';

@injectable()
export class UsersController {
  constructor(
    @inject(TYPES.ShowMeUseCaseService) private readonly showMeUseCase: ShowMeUseCaseService,
    @inject(TYPES.UpdateMeUseCaseService) private readonly updateMeUseCase: UpdateMeUseCaseService
  ) {}

  async me(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const id = Number(user.id);

    try {
      const userWithRoles = await this.showMeUseCase.execute(id);

      if (!userWithRoles) {
        throw new NotFoundException('User not found');
      }

      return ResponseHelper.success(res, UsersMapper.toUserWithRolesDto(userWithRoles));
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async updateMe(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const id = Number(user.id);
    const body = req.body as UpdateUserDto;

    // Mapping DTO (shared/transport) to Input (application)
    const input: UpdateMeInput = {
      email: body.email,
      password: body.password,
      currentPassword: body.currentPassword,
      firstName: body.firstName,
      lastName: body.lastName,
      avatar: body.avatar,
      status: body.isActive,
      roleIds: body.roleIds,
    };

    const updatedUser = await this.updateMeUseCase.execute(id, input);
    return ResponseHelper.success(res, UsersMapper.toUserWithRolesDto(updatedUser));
  }
}
