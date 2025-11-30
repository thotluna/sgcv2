import request from 'supertest';
import express, { Application } from 'express';
import { AuthService } from '../auth.service';

jest.mock('../auth.service');

const mockValidateUser = jest.fn();
const mockLogin = jest.fn();
const mockGetUserWithRoles = jest.fn();

(AuthService as jest.Mock).mockImplementation(() => ({
  validateUser: mockValidateUser,
  login: mockLogin,
  getUserWithRoles: mockGetUserWithRoles,
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const authRouter = require('../auth.routes').default;

function createApp(): Application {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
}

describe('POST /api/auth/login', () => {
  const app = createApp();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('must return a 200 status code and the token when the credentials are valid', async () => {
    const fakeUser = { id: 1, username: 'admin' };
    mockValidateUser.mockResolvedValue(fakeUser);
    mockLogin.mockResolvedValue({ access_token: 'jwt-token' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        user: { id: 1, username: 'admin' },
        token: 'jwt-token',
      },
      metadata: expect.objectContaining({
        timestamp: expect.any(String),
        requestId: expect.any(String),
      }),
    });
    expect(mockValidateUser).toHaveBeenCalledWith('admin', 'admin123');
    expect(mockLogin).toHaveBeenCalledWith(fakeUser);
  });

  it('must return a 401 status code when the credentials are invalid', async () => {
    mockValidateUser.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      },
      metadata: expect.objectContaining({
        timestamp: expect.any(String),
        requestId: expect.any(String),
      }),
    });
    expect(mockValidateUser).toHaveBeenCalledWith('admin', 'wrong');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('must return a 400 status code when username is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'admin123' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Username and password are required',
      },
    });
    expect(mockValidateUser).not.toHaveBeenCalled();
  });

  it('must return a 400 status code when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Username and password are required',
      },
    });
    expect(mockValidateUser).not.toHaveBeenCalled();
  });
});
