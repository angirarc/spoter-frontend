import { create } from 'zustand';

import { UserModel } from '@/lib/types/models';
import { initialState, LoadingStatus, newStatus } from '@/lib/types/state';
import { LoginCredentials, RegisterCredentials } from '@/lib/types/payloads';

import { handleError } from '@/lib/utils';
import { authService } from '@/lib/services/authService';
import { setAuth, getLocalStorageItem} from '@/lib/sharePreference';

interface AuthState {
    state: LoadingStatus;
    isAuthenticated: boolean;
    user: UserModel | null;
    loading: boolean;
    login: (payload: LoginCredentials) => Promise<void>;
    signin: (payload: RegisterCredentials) => Promise<void>;
    logout: () => void;
}

const initialStatus = {
    login: initialState,
    signin: initialState
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    state: initialStatus,

    login: async (payload) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'login', 'LOADING') });
            const resp = await authService.login(payload);
            if (resp) {
                setAuth(resp);
                set({ isAuthenticated: true, user: resp.user });
            }
        } catch (error) {
            handleError(error, set, state, 'login');
        }
    },

    signin: async (payload) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'signin', 'LOADING') });
            const resp = await authService.signin(payload);
            if (resp) {
                setAuth(resp);
                set({ isAuthenticated: true, user: resp.user });
            }
        } catch (error) {
            handleError(error, set, state, 'signin');
        }
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set({ isAuthenticated: false, user: null });
    },

    // Initialize auth state from localStorage
    ...(() => {
        const token = getLocalStorageItem('auth_token');
        const storedUser = getLocalStorageItem('auth_user');

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                return { isAuthenticated: true, user, loading: false };
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        }
        return { loading: false };
    })()
}));