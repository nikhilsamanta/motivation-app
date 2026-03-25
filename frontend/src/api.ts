import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the host IP dynamically from Expo's Constants
const hostUri = Constants.expoConfig?.hostUri;
const hostIp = hostUri ? hostUri.split(':')[0] : '192.168.1.13';

const BASE_URL = Platform.OS === 'web' 
    ? 'http://localhost:5000/api' 
    : `http://${hostIp}:5000/api`;


const apiFetch = async (endpoint: string, options: any = {}) => {
    const token = await AsyncStorage.getItem('token');
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`API Error (${response.status}):`, data);
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error: any) {
        console.error(`Fetch failure for ${url}:`, error.message);
        throw error;
    }
};

export const api = {
    auth: {
        login: (credentials: any) => apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (userData: any) => apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        getProfile: () => apiFetch('/auth/profile'),
        updateName: (name: string) => apiFetch('/auth/update-name', {
            method: 'PUT',
            body: JSON.stringify({ name })
        }),
        changePassword: (password: string) => apiFetch('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ password })
        }),
        savePushToken: (pushToken: string) => apiFetch('/auth/push-token', {
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
