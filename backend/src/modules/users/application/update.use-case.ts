import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { UpdateUserInput, UpdateUserPersistenceInput } from '@users/domain/dtos/user.dtos';
import { UserWithRolesEntity } from '@users/domain/user-entity';
import { UpdateUserService } from '@users/domain/update.service';
import { TYPES as AuthTypes } from '@auth/di/types';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';

@injectable()
export class UpdateUseCase {
  constructor(
    @inject(TYPES.UpdateUserService) private readonly service: UpdateUserService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(id: number, data: UpdateUserInput): Promise<UserWithRolesEntity> {
    const updateData: UpdateUserPersistenceInput = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      status: data.status,
      roleIds: data.roleIds,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.passwordHash = await this.hasher.hashPassword(data.password);
    }

    return this.service.update(id, updateData);
  }
}
