import { inject, injectable } from 'inversify';
import { UserWithRolesEntity } from '../domain/user-entity';
import { TYPES } from '../di/types';
import { TYPES as AuthTypes } from '@modules/auth/di/types';
import { UsersService } from '../domain/user.service';
import { UserNotFoundException } from '../domain/exceptions/user-no-found.exception';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';
import { BadRequestException } from '@shared/exceptions';
import { UpdateUserDto } from '../domain/dtos/user.dtos';

@injectable()
export class UpdateMeUseCaseService {
  constructor(
    @inject(TYPES.UsersService) private readonly service: UsersService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(id: number, data: UpdateUserDto): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    const updateData: Partial<UserWithRolesEntity> = { ...data };

    if (data.password) {
      if (!data.currentPassword) {
        throw new BadRequestException('Current password is required to set a new password');
      }

      const isPasswordValid = await this.hasher.comparePassword(
        data.currentPassword,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      updateData.passwordHash = await this.hasher.hashPassword(data.password);
    }

    delete (updateData as any).password;
    delete (updateData as any).currentPassword;

    return await this.service.updateUser(id, updateData);
  }
}
