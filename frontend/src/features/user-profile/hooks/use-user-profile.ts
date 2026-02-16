'use client';

import { useState, useEffect } from 'react';
import { profileService } from '../services/profile-service';
import { UserProfile, ProfileStats } from '../types';

/**
 * Custom hook for managing user profile data
 */
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const [profileResponse, statsResponse] = await Promise.all([
          profileService.getProfile(userId),
          profileService.getProfileStats(userId),
        ]);

        if (profileResponse.success && profileResponse.data) {
          setProfile(profileResponse.data);
        } else {
          setError(profileResponse.error || 'Failed to load profile');
        }

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const refresh = async () => {
    const response = await profileService.getProfile(userId);
    if (response.success && response.data) {
      setProfile(response.data);
    }
  };

  return {
    profile,
    stats,
    isLoading,
    error,
    refresh,
  };
}
