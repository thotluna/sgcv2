import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { UserEntity } from '@users/domain/user-entity';
import { ShowUserService } from '../domain/show.service';

@injectable()
export class ShowUserUseCaseService {
  constructor(@inject(TYPES.ShowUserService) private readonly userService: ShowUserService) {}

  async execute(id: number): Promise<UserEntity | null> {
    return this.userService.getUserWithRoles(id);
  }
}
