'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '../types';

interface ProfileCardProps {
  readonly profile: UserProfile;
}

export function ProfileCard({ profile }: Readonly<ProfileCardProps>) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'User';
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
            {initials}
          </div>
          <div>
            <CardTitle>{fullName}</CardTitle>
            <p className="text-muted-foreground text-sm">{profile.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-semibold">Role</h4>
            <p className="text-muted-foreground text-sm capitalize">{profile.role.toLowerCase()}</p>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold">Status</h4>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              profile.isActive
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold">Member Since</h4>
            <p className="text-muted-foreground text-sm">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold">Last Updated</h4>
            <p className="text-muted-foreground text-sm">
              {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
