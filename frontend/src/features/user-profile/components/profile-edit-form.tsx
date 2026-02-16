'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UpdateProfileInput } from '../types';

interface ProfileEditFormProps {
  readonly initialData: UpdateProfileInput;
  readonly onSubmit: (data: UpdateProfileInput) => Promise<void>;
  readonly onCancel?: () => void;
  readonly isLoading?: boolean;
}

export function ProfileEditForm({ initialData, onSubmit, onCancel, isLoading }: Readonly<ProfileEditFormProps>) {
  const [formData, setFormData] = useState<UpdateProfileInput>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="First Name"
            value={formData.firstName || ''}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Your first name"
          />
          <Input
            label="Last Name"
            value={formData.lastName || ''}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Your last name"
          />
          <div className="flex gap-4">
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
