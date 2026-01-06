import { inject, injectable } from 'inversify';
import { UserWithRolesEntity } from '../domain/user-entity';
import { TYPES } from '../di/types';
import { UsersService } from '../domain/user.service';
import { UserNotFoundException } from '../domain/exceptions/user-no-found.exception';

@injectable()
export class UpdateMeUseCaseService {
  constructor(@inject(TYPES.UsersService) private readonly service: UsersService) { }

  async execute(id: number, data: Partial<UserWithRolesEntity>): Promise<UserWithRolesEntity> {
    const user = await this.service.getUserWithRoles(id);

    if (!user) {
      throw new UserNotFoundException(id.toString());
    }

    // Basic logic: only allow updating allowed fields if needed, 
    // or rely on the service to handle permissions.
    return await this.service.updateUser(id, data);
  }
}
