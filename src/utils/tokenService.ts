// only for testing
import { loadEnvVariables } from "./loadEnvVariables";

loadEnvVariables();

const { AUTH0_DOMAIN,
    M2M_CLIENT_ID,
    M2M_CLIENT_SECRET, AUTH0_AUDIENCE } = process.env;

if (!AUTH0_DOMAIN || !M2M_CLIENT_ID || !M2M_CLIENT_SECRET || !AUTH0_AUDIENCE) {
    throw new Error('Please make sure that the .env file is in place and it has all the required variables');
}

export const getToken = async (client_id: string, client_secret: string) => {
    const url = `https://${AUTH0_DOMAIN}/oauth/token`;
    const data = {
        audience: AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
        client_id,
        client_secret
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const json = await response.json();

    return json.access_token;
};