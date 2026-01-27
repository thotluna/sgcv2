import { AuthController } from '@modules/auth/infrastructure/http/auth.controller';
import { AuthRoutes } from '@modules/auth/infrastructure/http/auth.routes';
import { globalErrorHandler } from '@shared/middleware/global-error.middleware';
import express, { Application } from 'express';
import request from 'supertest';

import { MOCK_LOGIN_REQUEST, MOCK_USER_TOKEN_DTO } from '../../helpers';

const controller = {
  login: jest.fn(),
};

describe('AuthRoutes', () => {
  let authRoutes: AuthRoutes;
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();
    authRoutes = new AuthRoutes(controller as unknown as AuthController);

    app = express();
    app.use(express.json());

    app.use('/', authRoutes.getRouter());
    app.use(globalErrorHandler);
  });

  it('should return a 200 status code and the token when the credentials are valid', async () => {
    controller.login.mockImplementation(async (_, res) => {
      const WRAPPED_SUCCESS_RESPONSE = {
        success: true,
        data: MOCK_USER_TOKEN_DTO,
        metadata: expect.anything(),
      };
      return res.status(200).json(WRAPPED_SUCCESS_RESPONSE);
    });

    const response = await request(app)
      .post('/login')
      .send(MOCK_LOGIN_REQUEST)
      .set('Accept', 'application/json');

    const user = MOCK_USER_TOKEN_DTO.user;

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        success: true,
        data: {
          user: {
            ...user,
            roles: ['admin'],
          },
          token: MOCK_USER_TOKEN_DTO.token,
        },
      })
    );

    expect(controller.login).toHaveBeenCalled();
  });

  it('should return 400 when credentials empty', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: '',
        password: '',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: expect.objectContaining({
        message: 'Validation failed',
      }),
    });
    expect(controller.login).not.toHaveBeenCalled();
  });
});
