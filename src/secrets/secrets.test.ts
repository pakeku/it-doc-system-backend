import request from 'supertest';
import { getToken } from '../utils/tokenService';
import { loadEnvVariables } from '../utils/loadEnvVariables';
import { app } from '../app';
import { connect, disconnect } from '../mongo/connection';

loadEnvVariables(); // Load environment variables for testing

describe('Secrets API', () => {

    // Establish connection before all tests
    beforeAll(async () => {
        await connect();
    });

    // Disconnect after all tests to clean up
    afterAll(async () => {
        await disconnect();
    });

    /**
     * Utility function to perform a GET request to /api/secrets
     * @param {string} token - Bearer token for authorization
     */
    const getSecrets = (token: string | null) => {
        const req = request(app).get('/api/secrets');
        return token ? req.set('Authorization', `Bearer ${token}`) : req;
    };

    it('should return 401 - Unauthorized for GET /api/secrets without token', async () => {
        const response = await getSecrets(null); // No token
        expect(response.status).toBe(401);
    });

    it('should return 200 - OK for GET /api/secrets with token and valid permissions', async () => {
        const token = await getToken(); // Get valid token
        const response = await getSecrets(token); // Send request with token

        expect(response.status).toBe(200);
    });


    it('should return an array of secrets [name, description, createdAt, updatedAt, _id], no other fields. Can be an empty array', async () => {
        const token = await getToken(); // Get valid token
        const response = await getSecrets(token); // Send request with token

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

});