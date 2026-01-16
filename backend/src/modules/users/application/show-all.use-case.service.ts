import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { ListUsersService } from '../domain/list.service';
import { UserFilterInput } from '../domain/dtos/user.dtos';

@injectable()
export class ShowAllUseCaseService {
  constructor(@inject(TYPES.ListUsersService) private readonly service: ListUsersService) {}

  async execute(filter: UserFilterInput) {
    return this.service.getAll(filter);
  }
}
