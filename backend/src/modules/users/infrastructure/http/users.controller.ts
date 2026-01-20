import { TYPES } from '@users/di/types';
import { UserEntity } from '@modules/users/domain/user-entity';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { GetUseCase } from '@modules/users/application/get.use-case';
import { UpdateMeUseCase } from '@modules/users/application/update-me.use-case';
import { UsersMapper } from '../mappers/users';
import { UpdateUserDto, UserFilterDto, CreateUserDto as SharedCreateUserDto } from '@sgcv2/shared';
import { ListUseCase } from '@modules/users/application/list.use-case';
import { CreateUseCase } from '@modules/users/application/create.use-case';
import { UpdateUseCase } from '@modules/users/application/update.use-case';

@injectable()
export class UsersController {
  constructor(
    @inject(TYPES.GetUseCase) private readonly getUseCase: GetUseCase,
    @inject(TYPES.UpdateMeUseCaseService) private readonly updateMeUseCase: UpdateMeUseCase,
    @inject(TYPES.ShowAllUseCaseService) private readonly showAllUseCase: ListUseCase,
    @inject(TYPES.CreateUserUseCaseService)
    private readonly createUserUseCase: CreateUseCase,
    @inject(TYPES.UpdateUserUseCaseService)
    private readonly updateUserUseCase: UpdateUseCase
  ) {}

  async me(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const id = Number(user.id);

    try {
      const userWithRoles = await this.getUseCase.execute(id);

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
    const input = UsersMapper.toUpdateInput(userDto);

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
    const { items: users, total } = await this.showAllUseCase.execute(filter);
    const limit = Number(filter.pagination?.limit) || 10;
    const offset = Number(filter.pagination?.offset) || 0;
    const page = Math.floor(offset / limit) + 1;

    return ResponseHelper.paginated(
      res,
      users.map((user: UserEntity) => UsersMapper.toUserDto(user)),
      {
        total,
        page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
      }
    );
  }

  async create(req: Request, res: Response): Promise<Response> {
    const createUserDto: SharedCreateUserDto = req.body;

    const input = UsersMapper.toCreateUserInput(createUserDto);

    const newUser = await this.createUserUseCase.execute(input);
    return ResponseHelper.success(res, UsersMapper.toUserDto(newUser));
  }

  async show(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const user = await this.getUseCase.execute(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseHelper.success(res, UsersMapper.toUserDto(user));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const userDto: UpdateUserDto = req.body;
    const input = UsersMapper.toUpdateInput(userDto);

    const updatedUser = await this.updateUserUseCase.execute(id, input);
    return ResponseHelper.success(res, UsersMapper.toUserDto(updatedUser));
  }
}
