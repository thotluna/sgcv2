import { inject, injectable } from 'inversify';
import { UserWithRolesEntity } from '../domain/user-entity';
import { TYPES } from '../di/types';
import { ShowUserService } from '../domain/show.service';
import { UserNotFoundException } from '../domain/exceptions/user-no-found.exception';

@injectable()
export class ShowMeUseCaseService {
  constructor(@inject(TYPES.ShowUserService) private readonly service: ShowUserService) {}
  async execute(id: number): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    return user;
  }
}
