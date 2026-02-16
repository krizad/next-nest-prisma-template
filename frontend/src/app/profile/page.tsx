'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/features/user-profile/components/profile-card';
import { ProfileStats } from '@/features/user-profile/components/profile-stats';
import { ProfileEditForm } from '@/features/user-profile/components/profile-edit-form';
import {
  UserProfile,
  UpdateProfileInput,
} from '@/features/user-profile/types';
import { apiClient } from '@/lib/api-client';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';

// Default profile stats
const defaultStats = {
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
};

// Helper function to transform API response to UserProfile
function transformApiResponseToProfile(data: any): UserProfile {
  return {
    id: data.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    isActive: data.isActive,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch profile data from backend on mount
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user?.id) {
      setError('Please login to view your profile');
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch current user profile using UUID from store
        const response = await apiClient.get(`/users/${user.id}`);

        if (response.success && response.data) {
          const transformedProfile = transformApiResponseToProfile(response.data);
          setProfile(transformedProfile);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, router]);

  const handleUpdateProfile = async (data: UpdateProfileInput) => {
    if (!profile) return;

    try {
      setIsLoading(true);
      const response = await apiClient.patch(`/users/${profile.id}`, data);

      if (response.success && response.data) {
        const transformedProfile = transformApiResponseToProfile(response.data);
        setProfile(transformedProfile);
        setIsEditing(false);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          <p className="font-medium">Error loading profile</p>
          <p className="text-sm">{error || 'Profile not found'}</p>
          {!isAuthenticated && (
            <Button
              onClick={() => router.push('/login')}
              className="mt-4"
              variant="outline"
            >
              Go to Login
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline" disabled={isLoading}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isEditing ? (
            <ProfileEditForm
              initialData={{
                firstName: profile.firstName ?? undefined,
                lastName: profile.lastName ?? undefined
              }}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileCard profile={profile} />
          )}
        </div>
        <div>
          <ProfileStats stats={defaultStats} />
        </div>
      </div>
    </div>
  );
}
