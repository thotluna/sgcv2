import { AuthService } from '../auth.service';
import { prisma } from '@config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('@config/prisma', () => ({
    prisma: {
        usuario: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    const service = new AuthService();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validateUser', () => {
        it('must return the user when the credentials are correct', async () => {
            const fakeUser = {
                id_usuario: 1,
                username: 'admin',
                password_hash: 'hashed',
            };
            (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(fakeUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser('admin', 'admin123');
            expect(result).toEqual(fakeUser);
            expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
                where: { username: 'admin' },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith('admin123', 'hashed');
        });

        it('must return null when the user does not exist', async () => {
            (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
            const result = await service.validateUser('noexiste', 'pwd');
            expect(result).toBeNull();
        });

        it('must return null when the password is incorrect', async () => {
            const fakeUser = {
                id_usuario: 1,
                username: 'admin',
                password_hash: 'hashed',
            };
            (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(fakeUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validateUser('admin', 'wrong');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('must return a signed JWT', async () => {
            process.env.JWT_SECRET = 'test_secret';
            const user = { id_usuario: 1, username: 'admin' };
            const fakeToken = 'signed.jwt.token';
            (jwt.sign as jest.Mock).mockReturnValue(fakeToken);

            const result = await service.login(user);
            expect(result).toEqual({ access_token: fakeToken });
            expect(jwt.sign).toHaveBeenCalledWith(
                { sub: 1, username: 'admin' },
                'test_secret',
                { expiresIn: '1d' }
            );
        });
    });
});