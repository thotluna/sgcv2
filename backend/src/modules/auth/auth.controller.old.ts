import { Request, Response } from 'express';
import { AuthService } from '@auth/auth.service.old';
import { LoginDto, UserDto } from '@sgcv2/shared';
import { ResponseHelper } from '@shared/utils/response.helpers';

export class AuthController {
  private authService: AuthService;

  constructor(service: AuthService) {
    this.authService = service;
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const dto: LoginDto = req.body;

      if (!dto.username || !dto.password) {
        return ResponseHelper.badRequest(res, 'Username and password are required');
      }
      const userRes = await this.authService.validateUser(dto.username, dto.password);
      let user: UserDto | null = null;
      if (userRes) {
        user = userRes as UserDto;
      }

      if (!user) {
        return ResponseHelper.unauthorized(res, 'Invalid credentials');
      }

      const tokenData = await this.authService.login({
        id: user.id,
        username: user.username,
      });

      return ResponseHelper.success(res, {
        user,
        token: tokenData.access_token,
      });
    } catch {
      return ResponseHelper.internalError(res, 'An error occurred during login');
    }
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    return ResponseHelper.success(res, {
      message: 'Logout successful',
      note: 'Client should remove the token from storage',
    });
  }

  async me(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as unknown as UserDto;

      if (!user) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const userWithRoles = await this.authService.getUserWithRoles(user.id);

      if (!userWithRoles) {
        return ResponseHelper.notFound(res, 'User not found');
      }

      return ResponseHelper.success(res, userWithRoles);
    } catch {
      return ResponseHelper.internalError(res, 'An error occurred while fetching user data');
    }
  }
}
