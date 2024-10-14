import request from 'supertest';
import { app } from '.';
import { getToken } from './utils/tokenService';

describe('Health Check API', () => {
    const methods = ['get', 'post', 'put', 'delete'] as const;
    const endpoints = { public: '/api/health/public', private: '/api/health/admin' };

    // Test all methods on the public endpoint
    methods.forEach((method) => {
        it(`should return 200 - OK for ${method.toUpperCase()} ${endpoints.public}`, async () => {
            const response = await (request(app) as any)[method](endpoints.public);

            // Check if the status code is 200
            expect(response.status).toBe(200);

            // Ensure the response body contains a single key "status"
            expect(Object.keys(response.body)).toContain('status');
            // Assert the response body has exactly one key
            expect(Object.keys(response.body)).toHaveLength(1);
        });
    });

    // checks for private endpoints with different methods

    // should return 401 - Unauthorized for GET /api/health/admin without token
    it('should return 401 - Unauthorized for GET /api/health/admin without token', async () => {
        const response = await request(app).get(endpoints.private);
        expect(response.status).toBe(401);
    });

    // should return 200 - OK for GET /api/health/admin with token and valid permissions: Read = "read:secrets"
    it('should return 200 - OK for GET /api/health/admin with token and valid permissions', async () => {
        const token = await getToken();
        const response = await request(app)
            .get(endpoints.private)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Object.keys(response.body)).toContain('status');
    });
});
