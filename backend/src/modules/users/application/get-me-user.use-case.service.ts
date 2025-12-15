import { inject, injectable } from 'inversify';
import { UserNotFoundException } from '@users/domain/exceptions/user-no-found.exception';
import { UsersService } from '@modules/users/domain/user.service';
import { TYPES } from '@users/di/types';

@injectable()
export class GetMeUserUseCaseService {
  private readonly usersService: UsersService;

  constructor(@inject(TYPES.UsersService) usersService: UsersService) {
    this.usersService = usersService;
  }

  async execute(userId: number) {
    const user = await this.usersService.getUserWithRoles(userId);

    if (!user) {
      throw new UserNotFoundException(userId.toString());
    }

    return user;
  }
}
