import { AuthController } from "@modules/auth/infrastructure/http/auth.controller";
import { UserNotFoundException } from "@modules/users/domain/exceptions/user-no-found.exception";
import { InvalidPasswordException } from "@modules/auth/domain/exceptions/invalid-password.exception";
import { MOCK_LOGIN_REQUEST, MOCK_USER_TOKEN_DTO } from "../../helpers";

const mockLoginUseCaseService = {
    execute: jest.fn(),
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
} as any;

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(() => {
        jest.clearAllMocks();
        authController = new AuthController(mockLoginUseCaseService as any);
    });


    it('should call LoginUseCaseService and return success DTO', async () => {
        mockLoginUseCaseService.execute.mockResolvedValue(MOCK_USER_TOKEN_DTO);

        const req = { body: MOCK_LOGIN_REQUEST } as any;

        await authController.login(req, mockResponse);

        expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);

        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining(MOCK_USER_TOKEN_DTO)
        );

        expect(mockResponse.status).not.toHaveBeenCalled();
    });


    it('should handle UserNotFoundException and return 404', async () => {
        mockLoginUseCaseService.execute.mockRejectedValue(new UserNotFoundException('admin'));

        const req = { body: MOCK_LOGIN_REQUEST } as any;

        await authController.login(req, mockResponse);

        expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    details: undefined,
                    message: 'User with id admin not found',
                },
            })
        );

    });


    it('should handle InvalidPasswordException and return 401', async () => {
        mockLoginUseCaseService.execute.mockRejectedValue(new InvalidPasswordException());

        const req = { body: MOCK_LOGIN_REQUEST } as any;

        await authController.login(req, mockResponse);

        expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid username, password',
                },
            })
        );
    });

    it('should handle generic Error and return 500', async () => {
        const genericError = new Error('Database connection failed');
        mockLoginUseCaseService.execute.mockRejectedValue(genericError);

        const req = { body: MOCK_LOGIN_REQUEST } as any;

        await authController.login(req, mockResponse);

        expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database connection failed',
                },
            })
        );
    });
});