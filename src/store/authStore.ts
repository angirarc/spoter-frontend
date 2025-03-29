'use client';

import { create } from 'zustand';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { UserModel } from '@/lib/types/models';
import { initialState, LoadingStatus, newStatus } from '@/lib/types/state';
import { LoginCredentials, RegisterCredentials } from '@/lib/types/payloads';

import { handleError } from '@/lib/utils';
import { authService } from '@/lib/services/authService';
import { setAuth, getLocalStorageItem, clearAuth, KEYS} from '@/lib/sharePreference';

interface AuthState {
    state: LoadingStatus;
    token: string | null;
    user: UserModel | null;
    isAuthenticated: boolean;
    logout: (router: AppRouterInstance) => void;
    me: (router: AppRouterInstance) => Promise<void>;
    login: (payload: LoginCredentials, router: AppRouterInstance) => Promise<void>;
    signup: (payload: RegisterCredentials, router: AppRouterInstance) => Promise<void>;
}

const initialStatus = {
    login: initialState,
    signup: initialState,
    me: initialState,
}

export const useAuthStore = create<AuthState>((set, get) => ({
    state: initialStatus,
    isAuthenticated: false,
    user: JSON.parse(getLocalStorageItem(KEYS.user) ?? ''),
    token: getLocalStorageItem(KEYS.accessToken),

    login: async (payload, router) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'login', 'LOADING') });
            const resp = await authService.login(payload);
            if (resp) {
                setAuth(resp);
                set({ 
                    isAuthenticated: true, 
                    user: resp.user, 
                    state: newStatus(state, 'login', 'SUCCESS') 
                });
                router.push('/');
            }
        } catch (error) {
            handleError(error, set, state, 'login');
        }
    },

    me: async (router) => {
        const { state, logout } = get();
        try {
            set({ state: newStatus(state, 'me', 'LOADING') });
            const resp = await authService.me();
            
            if (resp) {
                set({ 
                    isAuthenticated: true, 
                    user: resp, 
                    state: newStatus(state, 'me', 'SUCCESS') 
                });
                router.push('/');
            }
        } catch (error) {
            logout(router);
            handleError(error, set, state, 'me');
        }
    },

    signup: async (payload, router) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'signup', 'LOADING') });
            const resp = await authService.signup(payload);
            if (resp) {
                setAuth(resp);
                set({ 
                    isAuthenticated: true, 
                    user: resp.user, 
                    state: newStatus(state, 'signup', 'SUCCESS') 
                });
                router.push('/');
            }
        } catch (error) {
            handleError(error, set, state, 'signup');
        }
    },

    logout: (router) => {
        clearAuth();
        set({ isAuthenticated: false, user: null });
        router.push('/login');
    },
}));