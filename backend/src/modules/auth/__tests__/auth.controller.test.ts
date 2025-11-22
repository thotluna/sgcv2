import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';

jest.mock('../auth.service');

const mockValidateUser = jest.fn();
const mockLogin = jest.fn();
const mockGetUserWithRoles = jest.fn();

(AuthService as jest.Mock).mockImplementation(() => ({
    validateUser: mockValidateUser,
    login: mockLogin,
    getUserWithRoles: mockGetUserWithRoles,
}));

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(() => {
        authController = new AuthController();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return 400 when username is missing', async () => {
            const req = { body: { password: 'test123' } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Bad Request',
                message: 'Username and password are required'
            });
        });

        it('should return 400 when password is missing', async () => {
            const req = { body: { username: 'admin' } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Bad Request',
                message: 'Username and password are required'
            });
        });

        it('should return 401 when credentials are invalid', async () => {
            mockValidateUser.mockResolvedValue(null);

            const req = { body: { username: 'admin', password: 'wrong' } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
            expect(mockValidateUser).toHaveBeenCalledWith('admin', 'wrong');
        });

        it('should return 200 with token when credentials are valid', async () => {
            const fakeUser = { id_usuario: 1, username: 'admin' };
            mockValidateUser.mockResolvedValue(fakeUser);
            mockLogin.mockResolvedValue({ access_token: 'jwt-token' });

            const req = { body: { username: 'admin', password: 'admin123' } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.login(req, res);

            expect(res.json).toHaveBeenCalledWith({ access_token: 'jwt-token' });
            expect(mockValidateUser).toHaveBeenCalledWith('admin', 'admin123');
            expect(mockLogin).toHaveBeenCalledWith({
                id_usuario: 1,
                username: 'admin'
            });
        });
    });

    describe('logout', () => {
        it('should return success message', async () => {
            const req = {} as any;
            const res = {
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.logout(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: 'Logout successful',
                note: 'Client should remove the token from storage'
            });
        });
    });

    describe('me', () => {
        it('should return 401 when user is not authenticated', async () => {
            const req = { user: undefined } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.me(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
        });

        it('should return 404 when user is not found in database', async () => {
            mockGetUserWithRoles.mockResolvedValue(null);

            const req = { user: { id_usuario: 999 } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.me(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
            expect(mockGetUserWithRoles).toHaveBeenCalledWith(999);
        });

        it('should return user data without password when authenticated', async () => {
            const fakeUserWithRoles = {
                id_usuario: 1,
                username: 'admin',
                email: 'admin@test.com',
                password_hash: 'hashed_password',
                roles: [{ id: 1, nombre: 'Admin' }],
                permissions: [{ id: 1, modulo: 'ODS', accion: 'CREAR' }]
            };

            mockGetUserWithRoles.mockResolvedValue(fakeUserWithRoles);

            const req = { user: { id_usuario: 1 } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as any;

            await authController.me(req, res);

            expect(res.json).toHaveBeenCalledWith({
                id_usuario: 1,
                username: 'admin',
                email: 'admin@test.com',
                roles: [{ id: 1, nombre: 'Admin' }],
                permissions: [{ id: 1, modulo: 'ODS', accion: 'CREAR' }]
            });
            expect(mockGetUserWithRoles).toHaveBeenCalledWith(1);
        });
    });
});
