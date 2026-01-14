import { inject, injectable } from 'inversify';
import { UserWithRolesEntity } from '../domain/user-entity';
import { TYPES } from '../di/types';
import { TYPES as AuthTypes } from '@modules/auth/di/types';
import { UserNotFoundException } from '../domain/exceptions/user-no-found.exception';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';
import { BadRequestException } from '@shared/exceptions';
import { UpdateMeInput } from '../domain/dtos/user.dtos';
import { UpdateUserService } from '../domain/update.service';

@injectable()
export class UpdateMeUseCaseService {
  constructor(
    @inject(TYPES.UpdateUserService) private readonly service: UpdateUserService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(id: number, data: UpdateMeInput): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    const { password: _password, currentPassword: _currentPassword, ...rest } = data;
    const updateData: Partial<UserWithRolesEntity> = { ...rest };

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

    return await this.service.update(id, updateData);
  }
}
