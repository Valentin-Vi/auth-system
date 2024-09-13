import { API_URL, CLIENT_URL } from './constants';

export default async function api(route: string, options: RequestInit) {
    options.credentials = 'include';

    options.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': CLIENT_URL,
        'Access-Control-Allow-Credentials': 'true',
    };

    let res = await fetch(API_URL + route, options);

    if(res.status === 401) {

        console.log('Access token expired. Attempting to refresh...');
        
        const refRes = await fetch(API_URL + '/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        
        if(refRes.ok) {
            res = await fetch(API_URL + route, options);
        } else {
            console.log('Refresh token expired or is invalid. Login is required...');
            throw new Error('Session expired. Please log in again.');
        };
    };

    return res;
};