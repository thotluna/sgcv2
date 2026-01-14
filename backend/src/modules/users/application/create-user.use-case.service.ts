import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { UserRepository } from '@users/domain/user-repository';
import { CreateUserInput } from '@users/domain/dtos/user.dtos';
import { UserEntity } from '@users/domain/user-entity';
import bcrypt from 'bcrypt';

@injectable()
export class CreateUserUseCaseService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository
  ) { }

  async execute(data: CreateUserInput): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.userRepository.create({
      ...data,
      password: passwordHash,
    });
  }
}
