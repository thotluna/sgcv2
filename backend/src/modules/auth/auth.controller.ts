import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const dto: LoginDto = req.body;

      if (!dto.username || !dto.password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username and password are required',
        });
      }

      const user = await this.authService.validateUser(dto.username, dto.password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const tokenData = await this.authService.login({
        id: user.id,
        username: user.username,
      });

      const { passwordHash, ...userWithoutPassword } = user;

      return res.json({
        user: userWithoutPassword,
        token: tokenData.access_token,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during login',
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    return res.json({
      message: 'Logout successful',
      note: 'Client should remove the token from storage',
    });
  }

  async me(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as any;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userWithRoles = await this.authService.getUserWithRoles(user.id);

      if (!userWithRoles) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { passwordHash, ...userWithoutPassword } = userWithRoles;

      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user data',
      });
    }
  }
}
