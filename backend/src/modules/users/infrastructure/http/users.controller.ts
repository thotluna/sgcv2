import { TYPES } from '@users/di/types';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { ShowMeUseCaseService } from '@users/application/show-me.use-case.service';
import { UpdateMeUseCaseService } from '@users/application/update-me.use-case.service';
import { UsersMapper } from '../mappers/users';
import { UpdateUserDto, UserFilterDto } from '@sgcv2/shared';
import { UpdateMeInput } from '@modules/users/domain/dtos/user.dtos';
import { ShowAllUseCaseService } from '@modules/users/application/show-all.use-case.service';

@injectable()
export class UsersController {
  constructor(
    @inject(TYPES.ShowMeUseCaseService) private readonly showMeUseCase: ShowMeUseCaseService,
    @inject(TYPES.UpdateMeUseCaseService) private readonly updateMeUseCase: UpdateMeUseCaseService,
    @inject(TYPES.ShowAllUseCaseService) private readonly showAllUseCase: ShowAllUseCaseService
  ) { }

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
    const userDto: UpdateUserDto = req.body;

    const input: UpdateMeInput = {
      email: userDto.email,
      password: userDto.password,
      currentPassword: userDto.currentPassword,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      avatar: userDto.avatar,
      status: userDto.isActive,
      roleIds: userDto.roleIds,
    };

    const updatedUser = await this.updateMeUseCase.execute(id, input);
    return ResponseHelper.success(res, UsersMapper.toUserWithRolesDto(updatedUser));
  }

  async showAll(req: Request, res: Response): Promise<Response> {
    const rawQuery: any = req.query;
    const filter: UserFilterDto = {
      search: rawQuery.search,
      status: rawQuery.status,
      pagination: {
        limit: rawQuery.limit,
        offset: rawQuery.offset,
      },
    };
    const users = await this.showAllUseCase.execute(filter);
    return ResponseHelper.success(res, users.map(user => UsersMapper.toUserDto(user)));
  }
}
