import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { UserProfile, UpdateProfileInput, ProfileStats } from '../types';

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
   * Get user profile stats
   */
  async getProfileStats(userId: string): Promise<ApiResponse<ProfileStats>> {
    // Mock implementation as backend endpoint doesn't exist yet
    return Promise.resolve({
      success: true,
      data: {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
      },
      context: {
        requestId: 'mock-id',
        path: `/users/${userId}/stats`,
        method: 'GET',
        status: 200,
        timestamp: new Date().toISOString(),
      },
    });
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
