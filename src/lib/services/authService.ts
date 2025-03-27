import { httpClient } from '@/lib/utils';

import { UserModel } from '../types/models';
import { AuthResponse } from '@/lib/types/auth';
import { LoginCredentials, RegisterCredentials } from '@/lib/types/payloads';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        '/login/',
        credentials
      );
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async signup(data: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        '/signup/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async me(): Promise<UserModel> {
    try {
      const response = await httpClient.get<UserModel>(
        '/me/'
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  }
}

export const authService = new AuthService();