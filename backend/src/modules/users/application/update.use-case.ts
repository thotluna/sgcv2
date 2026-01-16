import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { UpdateUserInput } from '@users/domain/dtos/user.dtos';
import { UserEntity } from '@users/domain/user-entity';
import { UpdateUserService } from '@users/domain/update.service';
import { TYPES as AuthTypes } from '@auth/di/types';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';

@injectable()
export class UpdateUseCase {
  constructor(
    @inject(TYPES.UpdateUserService) private readonly service: UpdateUserService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(id: number, data: UpdateUserInput): Promise<UserEntity> {
    const updateData = { ...data };

    if (data.password) {
      updateData.password = await this.hasher.hashPassword(data.password);
    }

    return this.service.update(id, updateData);
  }
}
