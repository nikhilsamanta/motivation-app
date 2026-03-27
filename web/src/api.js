// API configuration for production and development
const BASE_URL = import.meta.env.VITE_API_URL || 'https://motivation-app-a3dgajgzdcfcfdd2.southeastasia-01.azurewebsites.net/api';

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `${token}`;
    }

    const url = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`Fetch failure for ${url}:`, error.message);
        throw error;
    }
};

export const api = {
    auth: {
        login: (credentials) => apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (userData) => apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        getProfile: () => apiFetch('/auth/profile'),
        updateName: (name) => apiFetch('/auth/update-name', {
            method: 'PUT',
            body: JSON.stringify({ name })
        }),
        changePassword: (password) => apiFetch('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ password })
        }),
        getReferrals: () => apiFetch('/auth/referrals'),
    },
    quotes: {
        getAll: () => apiFetch('/quotes/all')
    }
};

export default api;
