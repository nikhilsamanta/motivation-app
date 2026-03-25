import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the host IP dynamically from Expo's Constants
const hostUri = Constants.expoConfig?.hostUri;
const hostIp = hostUri ? hostUri.split(':')[0] : '192.168.1.13';

const BASE_URL = Platform.OS === 'web' 
    ? 'http://localhost:5000/api' 
    : `http://${hostIp}:5000/api`;


const apiFetch = async (endpoint, options = {}) => {
    const token = await AsyncStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
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
        savePushToken: (pushToken) => apiFetch('/auth/push-token', {
            method: 'PUT',
            body: JSON.stringify({ pushToken })
        }),
        testPush: () => apiFetch('/auth/test-push', { method: 'POST' }),
        getReferrals: () => apiFetch('/auth/referrals'),
    },
    quotes: {
        getAll: () => apiFetch('/quotes/all')
    }
};
