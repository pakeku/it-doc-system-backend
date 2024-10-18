import request from 'supertest';
import { getToken } from '../utils/tokenService';
import { loadEnvVariables } from '../utils/loadEnvVariables';
import { app } from '../app';
import { connect, disconnect } from '../mongo/connection';
import { generateAdminToken, generateNonPrivilegedToken } from './secrets.helper';

loadEnvVariables(); // Load environment variables for testing

describe('Create Secret: API', () => {

    // Establish connection before all tests
    beforeAll(async () => {
        loadEnvVariables(); // Load environment variables for testing   
        await connect();
    });

    // Disconnect after all tests to clean up
    afterAll(async () => {
        await disconnect();
    });

    it('should return 401 - Unauthorized for POST /api/secrets without token', async () => {
        const response = await request(app).post('/api/secrets');
        expect(response.status).toBe(401);
    });

    it('should return 403 - Forbidden for POST /api/secrets with valid token, but missing permissions: create:secrets', async () => {
        const token = await generateNonPrivilegedToken(); 
        const response = await request(app).post('/api/secrets').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403); 
    });

    it('should return 400 - Bad Request for POST /api/secrets with missing required fields', async () => {
        const token = await generateAdminToken(); 
        const response = await request(app).post('/api/secrets').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });

    it('should return 201 - Created for POST /api/secrets with valid token and valid payload', async () => {
        const newSecret = { name: 'Test Secret', description: 'A simple test with jest', secretValue: 'Hello World - 2024. This is a super secret.' }
        const token = await generateAdminToken(); 
        const response = await request(app).post('/api/secrets')
            .set('Authorization', `Bearer ${token}`)
            .send(newSecret);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('name', newSecret.name);
        expect(response.body).toHaveProperty('description', newSecret.description);
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
        expect(response.body).toHaveProperty('_id');
    });
})


describe('Read Secrets: API', () => {

    // Establish connection before all tests
    beforeAll(async () => {
        loadEnvVariables(); // Load environment variables for testing
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

    /**
     * const decryptSecret = (token: string | null, secretId: string) => {
        return request(app).get(`/api/secrets/${secretId}/decrypted`)
            .set('Authorization', `Bearer ${token}`)
    };
     */

    it('should return 401 - Unauthorized for GET /api/secrets without token', async () => {
        const response = await getSecrets(null); // No token
        expect(response.status).toBe(401);
    });

    it('should return 403 - Forbidden for GET /api/secrets with valid token, but missing permissions: read:secrets', async () => {
        const token = await generateNonPrivilegedToken(); // Get non-privileged token
        const response = await getSecrets(token); // Send request with token
        expect(response.status).toBe(403); // 403 - Forbidden
    })


    it('should return 200 - OK for GET /api/secrets with token and valid permissions', async () => {
        const token = await generateAdminToken(); // Get admin token

        // Send request with token
        const response = await getSecrets(token);

        // Check response status
        expect(response.status).toBe(200);

        // Validate that the response body is an array
        expect(Array.isArray(response.body)).toBe(true);

        // Check the structure and types of secrets if any are returned
        if (response.body.length > 0) {
            const firstSecret = response.body[0];

            // Check for the presence of required properties
            expect(firstSecret).toHaveProperty('name');
            expect(firstSecret).toHaveProperty('description');
            expect(firstSecret).toHaveProperty('createdAt');
            expect(firstSecret).toHaveProperty('updatedAt');
            expect(firstSecret).toHaveProperty('_id');

            // Validate that the properties have the correct data types
            expect(typeof firstSecret.name).toBe('string');
            expect(typeof firstSecret.description).toBe('string');
            expect(new Date(firstSecret.createdAt)).toBeInstanceOf(Date);
            expect(new Date(firstSecret.updatedAt)).toBeInstanceOf(Date);
            expect(typeof firstSecret._id).toBe('string');

            // Ensure the object has exactly the expected keys
            const expectedKeys = ['name', 'description', 'createdAt', 'updatedAt', '_id'];
            expect(Object.keys(firstSecret).sort()).toEqual(expectedKeys.sort());
        } else {
            // Handle the case where no secrets are returned
            console.warn('No secrets found in response.');
        }
    });


    // decrypt path = /api/secrets/:secretId/decrypted
    it('should return 401 - Unauthorized for GET /api/secrets/:secretId/decrypted without token', async () => {
        const response = await request(app).get('/api/secrets/123/decrypted');
        expect(response.status).toBe(401);
    });

    it('should return 403 - Forbidden for GET /api/secrets/:secretId/decrypted with valid token, but missing permissions: decrypt:secrets', async () => {
        const token = await generateNonPrivilegedToken(); // Get non-privileged token
        const response = await request(app).get('/api/secrets/123/decrypted').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403); // 403 - Forbidden
    });

    it('should return 200 - OK for GET /api/secrets/:secretId/decrypted with valid token, valid permissions, and valid _id', async () => {
        const secrets = await request(app).get('/api/secrets').set('Authorization', `Bearer ${await generateAdminToken()}`);
        const firstSecret = secrets.body[0];
        const response = await request(app).get(`/api/secrets/${firstSecret._id}/decrypted`).set('Authorization', `Bearer ${await generateAdminToken()}`);
        expect(response.status).toBe(200);
    })
});
