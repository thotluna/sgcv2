import { inject, injectable } from 'inversify';
import { UserWithRolesEntity } from '../domain/user-entity';
import { TYPES } from '../di/types';
import { TYPES as AuthTypes } from '@modules/auth/di/types';
import { UsersService } from '../domain/user.service';
import { UserNotFoundException } from '../domain/exceptions/user-no-found.exception';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';

@injectable()
export class UpdateMeUseCaseService {
  constructor(
    @inject(TYPES.UsersService) private readonly service: UsersService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(
    id: number,
    data: Partial<UserWithRolesEntity> & { password?: string }
  ): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    const updateData: Partial<UserWithRolesEntity> = { ...data };

    if (data.password) {
      updateData.passwordHash = await this.hasher.hashPassword(data.password);
      delete (updateData as any).password;
    }

    return await this.service.updateUser(id, updateData);
  }
}
