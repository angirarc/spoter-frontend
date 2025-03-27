import { httpClient } from '@/lib/utils';
import { AuthResponse } from '@/lib/types/auth';
import { LoginCredentials, RegisterCredentials } from '@/lib/types/payloads';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      '/login/',
      credentials
    );
    return response.data;
  }

  async signin(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      '/signin/',
      data
    );
    return response.data;
  }
}

export const authService = new AuthService();