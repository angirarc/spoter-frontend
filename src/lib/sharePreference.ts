/* eslint-disable no-unused-vars */
'use client';

import { AuthResponse } from "./types/auth";
import { UserModel } from "./types/models";

// access token
export enum KEYS {
    accessToken = 'accessToken',
    user = 'user',
}

export const setLocalStorageItem = (key: KEYS, value: string | number) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value.toString());
    }
};

export const getLocalStorageItem = (key: KEYS) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
};

export const setAuth = (resp: AuthResponse) => {
    try {
        setLocalStorageItem(KEYS.accessToken, resp.token);
        setLocalStorageItem(KEYS.user, JSON.stringify(resp.user));
    } catch (e) {
        console.error(e);
    }
};

export const getAccessToken = (): string | undefined => {
    try {
        const token = getLocalStorageItem(KEYS.accessToken);

        if (!token) return undefined;

        return token;
    } catch (e) {
        console.error(e);
    }
};

export const getUser = (): UserModel | undefined => {
    try {
        const user = getLocalStorageItem(KEYS.user);
        if (user) {
            return JSON.parse(user);
        }
        return undefined;
    } catch (e) {
        console.log(e);
    }
};

export const clearAuth = () => {
    try {
        return localStorage.clear();
    } catch (e) {
        console.log(e);
    }
};
