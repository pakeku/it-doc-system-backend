// only for testing
import dotenv from 'dotenv';
dotenv.config

const { AUTH0_DOMAIN,
    M2M_CLIENT_ID,
    M2M_CLIENT_SECRET, AUTH0_AUDIENCE } = process.env;

if (!AUTH0_DOMAIN || !M2M_CLIENT_ID || !M2M_CLIENT_SECRET || !AUTH0_AUDIENCE) {
    throw new Error('Please make sure that the .env file is in place and it has all the required variables');
}

export const getToken = async () => {
    const url = `https://${AUTH0_DOMAIN}/oauth/token`;
    const data = {
        audience: AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
        client_id: M2M_CLIENT_ID,
        client_secret: M2M_CLIENT_SECRET
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