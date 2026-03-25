import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { registerForPushNotificationsAsync } from '../hooks/useNotifications';

export interface User {
    _id: string;
    name: string;
    email: string;
    referralCode: string;
    referredBy?: string;
    points: number;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, referredBy?: string) => Promise<any>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<User>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoading: true,
    login: async (email: string, password: string) => {},
    register: async (name: string, email: string, password: string, referredBy?: string) => ({}),
    logout: async () => {},
    refreshProfile: async () => ({} as User),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setupNotifications = async () => {
        try {
            const pToken = await registerForPushNotificationsAsync();
            if (pToken) {
                await api.auth.savePushToken(pToken);
                console.log('Push token saved to server');
            }
        } catch (e) {
            console.log('Error setting up notifications', e);
        }
    };

    const loadStorageData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                try {
                    const profileData = await api.auth.getProfile();
                    setUser(profileData);
                    setupNotifications();
                } catch (e) {
                    console.log('Token invalid or expired', e);
                    await AsyncStorage.removeItem('token');
                    setToken(null);
                }
            }
        } catch (error) {
            console.error('Failed to load storage data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStorageData();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await api.auth.login({ email, password });
        const newToken = data.token;
        await AsyncStorage.setItem('token', newToken);
        setToken(newToken);
        
        const profileData = await api.auth.getProfile();
        setUser(profileData);
        setupNotifications();
    };

    const register = async (name: string, email: string, password: string, referredBy?: string) => {
        const data = await api.auth.register({ name, email, password, referredBy });
        return data;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const refreshProfile = async () => {
        const profileData = await api.auth.getProfile();
        setUser(profileData);
        return profileData;
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
