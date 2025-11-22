import { prisma } from '../../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    private readonly SALT_ROUNDS = 10;

    async validateUser(username: string, password: string) {
        const user = await prisma.usuario.findUnique({ where: { username } });
        if (!user) return null;
        const valid = await this.comparePassword(password, user.password_hash);
        return valid ? user : null;
    }

    async login(user: { id_usuario: number; username: string }) {
        const payload = { sub: user.id_usuario, username: user.username };
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
        const user = await prisma.usuario.findUnique({
            where: { id_usuario: userId },
            include: {
                usuario_rol: {
                    include: {
                        rol: {
                            include: {
                                rol_permiso: {
                                    include: {
                                        permiso: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) return null;

        const roles = user.usuario_rol.map(ur => ur.rol);
        const permissions = roles.flatMap(role =>
            role.rol_permiso.map(rp => rp.permiso)
        );

        return {
            ...user,
            roles,
            permissions
        };
    }
}
