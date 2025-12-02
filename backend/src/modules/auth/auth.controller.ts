import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseHelper } from '../../shared/utils/response.helpers';

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
      const user = await this.authService.validateUser(dto.username, dto.password);

      if (!user) {
        return ResponseHelper.unauthorized(res, 'Invalid credentials');
      }

      const tokenData = await this.authService.login({
        id: user.id,
        username: user.username,
      });

      const { passwordHash, ...userWithoutPassword } = user;

      return ResponseHelper.success(res, {
        user: userWithoutPassword,
        token: tokenData.access_token,
      });
    } catch (error) {
      console.error('Login error:', error);
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
      const user = req.user as any;

      if (!user) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const userWithRoles = await this.authService.getUserWithRoles(user.id);

      if (!userWithRoles) {
        return ResponseHelper.notFound(res, 'User not found');
      }

      return ResponseHelper.success(res, userWithRoles);
    } catch (error) {
      console.error('Get user error:', error);
      return ResponseHelper.internalError(res, 'An error occurred while fetching user data');
    }
  }
}
