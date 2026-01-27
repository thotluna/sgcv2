import { TYPES } from '@users/di/types';
import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { ShowUserService } from '@users/domain/show.service';
import { UserWithRolesEntity } from '@users/domain/user-entity';
import { inject, injectable } from 'inversify';

@injectable()
export class GetUseCase {
  constructor(@inject(TYPES.ShowUserService) private readonly service: ShowUserService) {}

  async execute(id: number): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    return user;
  }
}
