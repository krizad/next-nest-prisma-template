import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { UserProfile, UpdateProfileInput } from '../types';

/**
 * User Profile API Service
 */
export const profileService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(`/users/${userId}/profile`);
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileInput): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(`/users/${userId}/profile`, data);
  },

  /**
   * Upload profile avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return fetch(`/api/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  },
};
