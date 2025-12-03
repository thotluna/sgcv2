import request from 'supertest';
import express, { Application } from 'express';
import { AuthServiceMock } from './auth.service.mock';
import { AuthController } from '../auth.controller';
import { AuthRoutes } from '../auth.routes';

describe('POST /api/auth/login', () => {
  let app: Application;
  let service: AuthServiceMock;

  beforeEach(() => {
    service = new AuthServiceMock();
    const controller = new AuthController(service);
    const router = new AuthRoutes(controller);

    app = express();
    app.use(express.json());
    app.use('/api/auth', router.getRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('must return a 200 status code and the token when the credentials are valid', async () => {
    const fakeUser = { id: 1, username: 'admin' };
    service.validateUser.mockResolvedValue(fakeUser);
    service.login.mockResolvedValue({ access_token: 'jwt-token' });

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
    expect(service.validateUser).toHaveBeenCalledWith('admin', 'admin123');
    expect(service.login).toHaveBeenCalledWith(fakeUser);
  });

  it('must return a 401 status code when the credentials are invalid', async () => {
    service.validateUser.mockResolvedValue(null);

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
    expect(service.validateUser).toHaveBeenCalledWith('admin', 'wrong');
    expect(service.login).not.toHaveBeenCalled();
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
    expect(service.validateUser).not.toHaveBeenCalled();
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
    expect(service.validateUser).not.toHaveBeenCalled();
  });
});
