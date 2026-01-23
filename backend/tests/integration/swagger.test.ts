import request from 'supertest';
import app from '../../src/app';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

describe('Swagger Integration Test', () => {
  it('should serve swagger documentation at /api/docs/', async () => {
    const response = await request(app).get('/api/docs/');
    // Swagger UI returns HTML
    expect(response.status).toBe(200);
    expect(response.text).toContain('<html');
    expect(response.text).toContain('swagger-ui');
  });

  it('should redirect /api/docs to /api/docs/', async () => {
    const response = await request(app).get('/api/docs');
    expect([301, 302]).toContain(response.status);
  });
});
