import { CreateUseCase } from '@modules/users/application/create.use-case';
import { GetUseCase } from '@modules/users/application/get.use-case';
import { ListUseCase } from '@modules/users/application/list.use-case';
import { UpdateUseCase } from '@modules/users/application/update.use-case';
import { UpdateMeUseCase } from '@modules/users/application/update-me.use-case';
import { UserEntity } from '@modules/users/domain/user-entity';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { TYPES } from '@users/di/types';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { CreateUserDto as SharedCreateUserDto, UpdateUserDto, UserFilterDto } from '@sgcv2/shared';

import { UsersMapper } from '../mappers/users';

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

  /**
   * @swagger
   * /users/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user profile
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/UserWithRolesDto'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
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

  /**
   * @swagger
   * /users/me:
   *   patch:
   *     summary: Update current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserDto'
   *     responses:
   *       200:
   *         description: Profile updated
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/UserWithRolesDto'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   */
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

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: List all users (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *         description: Search by username or email
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [ACTIVE, INACTIVE, BLOCKED] }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 10 }
   *       - in: query
   *         name: offset
   *         schema: { type: integer, default: 0 }
   *     responses:
   *       200:
   *         description: Paginated user list
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
   *                         $ref: '#/components/schemas/UserDto'
   *                     metadata:
   *                       $ref: '#/components/schemas/Pagination'
   */
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

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: User created
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/UserDto'
   *       400:
   *         description: Bad request
   */
  async create(req: Request, res: Response): Promise<Response> {
    const createUserDto: SharedCreateUserDto = req.body;

    const input = UsersMapper.toCreateUserInput(createUserDto);

    const newUser = await this.createUserUseCase.execute(input);
    return ResponseHelper.success(res, UsersMapper.toUserDto(newUser));
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/UserDto'
   *       404:
   *         description: User not found
   */
  async show(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const user = await this.getUseCase.execute(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseHelper.success(res, UsersMapper.toUserDto(user));
  }

  /**
   * @swagger
   * /users/{id}:
   *   patch:
   *     summary: Update user by ID (Admin only)
   *     tags: [Users]
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
   *             $ref: '#/components/schemas/UpdateUserDto'
   *     responses:
   *       200:
   *         description: User updated
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/UserDto'
   *       404:
   *         description: User not found
   */
  async update(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const userDto: UpdateUserDto = req.body;
    const input = UsersMapper.toUpdateInput(userDto);

    const updatedUser = await this.updateUserUseCase.execute(id, input);
    return ResponseHelper.success(res, UsersMapper.toUserDto(updatedUser));
  }
}
