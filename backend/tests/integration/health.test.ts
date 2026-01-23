import request from 'supertest';
import app from '../../src/app';

// Mock the repository class before importing app (or rely on jest hoisting)
jest.mock('../../src/modules/support/infrastructure/persist/prisma-health-check.repository', () => {
  return {
    PrismaHealthCheckRepository: jest.fn().mockImplementation(() => {
      return {
        checkDatabase: jest.fn().mockResolvedValue(true),
      };
    }),
  };
});

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

describe('Health Check Integration Test', () => {
  it('should return 200 OK and health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('status', 'ok');
    expect(response.body.data).toHaveProperty('database', 'connected');
    expect(response.body.data).toHaveProperty('timestamp');
  });
});
