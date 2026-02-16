import { apiClient } from '@/lib/api-client';
import type { UserDto, LoginResponseDto } from '@fullstack/shared-types';
import { type ApiResponse } from '@/types/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Auth service - handles user authentication
 * Example: POST/GET from real backend
 */
export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponseDto>> {
    return apiClient.post<LoginResponseDto>('/auth/login', credentials);
  },

  async register(data: RegisterRequest): Promise<ApiResponse<UserDto>> {
    return apiClient.post<UserDto>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/logout');
  },

  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    return apiClient.get<UserDto>('/auth/me');
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },
};
