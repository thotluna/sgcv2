import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * GET /api/users/me - Get current user profile
   */
  async me(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as any;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userWithRoles = await this.usersService.getUserWithRoles(user.id);

      if (!userWithRoles) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(userWithRoles);
    } catch (error) {
      console.error('Get current user error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user data',
      });
    }
  }

  /**
   * GET /api/users - Get all users (admin only)
   */
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isActiveQuery = req.query.isActive as string | undefined;
      let isActive: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | undefined = undefined;

      if (isActiveQuery === 'ACTIVE') isActive = 'ACTIVE';
      if (isActiveQuery === 'INACTIVE') isActive = 'INACTIVE';
      if (isActiveQuery === 'BLOCKED') isActive = 'BLOCKED';

      const result = await this.usersService.findAll(page, limit, { isActive });

      return res.json(result);
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching users',
      });
    }
  }

  /**
   * GET /api/users/:id - Get user by ID (admin only)
   */
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await this.usersService.getUserWithRoles(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user',
      });
    }
  }

  /**
   * POST /api/users - Create new user (admin only)
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreateUserDto = req.body;

      // Validate required fields
      if (!dto.username || !dto.email || !dto.password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username, email, and password are required',
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid email format',
        });
      }

      // Validate password length
      if (dto.password.length < 6) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Password must be at least 6 characters long',
        });
      }

      const user = await this.usersService.createUser(dto);

      return res.status(201).json(user);
    } catch (error: any) {
      console.error('Create user error:', error);

      if (error.message === 'Username already exists' || error.message === 'Email already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message,
        });
      }

      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while creating user',
      });
    }
  }

  /**
   * PUT /api/users/:id - Update user
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateUserDto = req.body;
      const currentUser = req.user as any;

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      // Users can only update their own profile unless they're admin
      const isAdmin = currentUser.roles?.some((role: any) => role.name === 'admin');

      if (!isAdmin && currentUser.id !== id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only update your own profile',
        });
      }

      // Validate email format if provided
      if (dto.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.email)) {
          return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid email format',
          });
        }
      }

      // Validate password length if provided
      if (dto.password && dto.password.length < 6) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Password must be at least 6 characters long',
        });
      }

      // Only admins can update roles
      if (dto.roleIds && !isAdmin) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Only administrators can update user roles',
        });
      }

      const user = await this.usersService.updateUser(id, dto);

      return res.json(user);
    } catch (error: any) {
      console.error('Update user error:', error);

      if (error.message === 'User not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        });
      }

      if (error.message === 'Email already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message,
        });
      }

      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating user',
      });
    }
  }

  /**
   * DELETE /api/users/:id - Delete user (soft delete, admin only)
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await this.usersService.deleteUser(id);

      return res.json({
        message: 'User deactivated successfully',
        user,
      });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while deleting user',
      });
    }
  }
}
