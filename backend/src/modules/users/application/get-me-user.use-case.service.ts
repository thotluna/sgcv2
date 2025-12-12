import { inject, injectable } from 'inversify';
import { UserNotFoundException } from '@users/domain/exceptions/user-no-found.exception';
import { UsersService } from '@modules/users/users.service.old';
import { TYPES } from '@users/di/types';

@injectable()
export class GetMeUserUseCaseService {
  constructor(@inject(TYPES.UsersService) private readonly usersService: UsersService) {}

  async execute(userId: number) {
    const user = await this.usersService.getUserWithRoles(userId);

    if (!user) {
      throw new UserNotFoundException(userId.toString());
    }

    return user;
  }
}
