import { inject, injectable } from 'inversify';
import { UserWithRolesEntity } from '@users/domain/user-entity';
import { TYPES } from '@users/di/types';
import { TYPES as AuthTypes } from '@modules/auth/di/types';
import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';
import { BadRequestException } from '@shared/exceptions';
import { UpdateMeInput, UpdateUserPersistenceInput } from '@users/domain/dtos/user.dtos';
import { UpdateUserService } from '@users/domain/update.service';

@injectable()
export class UpdateMeUseCase {
  constructor(
    @inject(TYPES.UpdateUserService) private readonly service: UpdateUserService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(id: number, data: UpdateMeInput): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    const updateData: UpdateUserPersistenceInput = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      status: data.status,
      roleIds: data.roleIds,
    };

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
