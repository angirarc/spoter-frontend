'use client';

import { UserModel } from "./types/models";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: {
        dateTime: string;
        unix: number;
    };
}

// access token
enum KEYS {
    accessToken = 'accessToken',
    user = 'user',
}

export const setLocalStorageItem = (key: string, value: string | number) => {
    localStorage.setItem(key, value.toString());
};

export const getLocalStorageItem: any = (key: string) => {
    return localStorage.getItem(key);
};

export const getAccessToken = (): string | undefined => {
    try {
        const token = localStorage.getItem(KEYS.accessToken);

        if (!token) return undefined;

        return token;
    } catch (e) {
        console.error(e);
    }
};

// user
export const setUser = (user: UserModel) => {
    try {
        localStorage.setItem(KEYS.user, JSON.stringify(user));
    } catch (e) {
        console.error(e);
    }
};

export const getUser = (): UserModel | undefined => {
    try {
        const user = localStorage.getItem(KEYS.user);
        if (user) {
            return JSON.parse(user);
        }
        return undefined;
    } catch (e) {
        console.log();
    }
};

export const destory = () => {
    try {
        return localStorage.clear();
    } catch (e) {
        console.log();
    }
};
