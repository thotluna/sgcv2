import { AuthService } from '@modules/auth/auth.service.old';

export class AuthServiceMock implements AuthService {
  validateUser: jest.Mock;
  login: jest.Mock;
  getUserWithRoles: jest.Mock;
  hashPassword: jest.Mock;
  comparePassword: jest.Mock;

  constructor() {
    this.validateUser = jest.fn();
    this.login = jest.fn();
    this.getUserWithRoles = jest.fn();
    this.hashPassword = jest.fn().mockImplementation((password: string) => {
      return Promise.resolve(password);
    });
    this.comparePassword = jest
      .fn()
      .mockImplementation((plainPassword: string, hashedPassword: string) => {
        return Promise.resolve(plainPassword === hashedPassword);
      });
  }
}
