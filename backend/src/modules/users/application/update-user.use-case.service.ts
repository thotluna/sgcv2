import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { UpdateUserInput } from '@users/domain/dtos/user.dtos';
import { UserEntity } from '@users/domain/user-entity';
import bcrypt from 'bcrypt';
import { UpdateUserService } from '../domain/update.service';

@injectable()
export class UpdateUserUseCaseService {
  constructor(@inject(TYPES.UpdateUserService) private readonly userService: UpdateUserService) {}

  async execute(id: number, data: UpdateUserInput): Promise<UserEntity> {
    const updateData = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.userService.update(id, updateData);
  }
}
