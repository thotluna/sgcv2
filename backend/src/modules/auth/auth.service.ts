import { prisma } from '../../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  async validateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    const valid = await this.comparePassword(password, user.passwordHash);

    return valid ? user : null;
  }

  async login(user: { id: number; username: string }) {
    const payload = { sub: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    return { access_token: token };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserWithRoles(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const roles = user.roles.map(ur => ur.role);
    const permissions = roles.flatMap(role => role.permissions.map(rp => rp.permission));

    return {
      ...user,
      roles,
      permissions,
    };
  }
}
