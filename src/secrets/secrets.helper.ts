import { loadEnvVariables } from "../utils/loadEnvVariables";
import { getToken } from "../utils/tokenService";

// Load environment variables from .env file
loadEnvVariables();

// Destructure and validate the required environment variables
const {
    M2M_CLIENT_ID,
    M2M_CLIENT_SECRET,
    M2M_CLIENT_ID_NO_PERMISSIONS,
    M2M_CLIENT_SECRET_NO_PERMISSIONS
} = process.env;

// Check if all required environment variables are defined
if (!M2M_CLIENT_ID || !M2M_CLIENT_SECRET || !M2M_CLIENT_ID_NO_PERMISSIONS || !M2M_CLIENT_SECRET_NO_PERMISSIONS) {
    throw new Error('Missing required environment variables. Ensure the .env file is set up correctly.');
}

// Function to generate a token with admin privileges
export const generateAdminToken = async (): Promise<string> => {
    try {
        return await getToken(M2M_CLIENT_ID, M2M_CLIENT_SECRET);
    } catch (error) {
        console.error('Error generating admin token:', error);
        throw new Error('Failed to generate admin token.');
    }
};

// Function to generate a non-privileged token
export const generateNonPrivilegedToken = async (): Promise<string> => {
    try {
        return await getToken(M2M_CLIENT_ID_NO_PERMISSIONS, M2M_CLIENT_SECRET_NO_PERMISSIONS);
    } catch (error) {
        console.error('Error generating non-privileged token:', error);
        throw new Error('Failed to generate non-privileged token.');
    }
};