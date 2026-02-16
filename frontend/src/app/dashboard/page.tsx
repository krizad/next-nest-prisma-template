'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast-provider';
import { useFetchWithToast, useMutationWithToast } from '@/hooks/use-fetch-with-toast';
import { apiClient } from '@/lib/api-client';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role?: string;
  createdAt?: string;
}

const stats = [
  { label: 'Total Users', value: '2,543', change: '+12%' },
  { label: 'Active Projects', value: '18', change: '+3' },
  { label: 'Revenue', value: '$42,350', change: '+18%' },
  { label: 'Conversion', value: '3.2%', change: '+0.3%' },
];

const recentActivity = [
  { id: 1, action: 'New user registered', time: '2 minutes ago' },
  { id: 2, action: 'Project "Website Redesign" completed', time: '1 hour ago' },
  { id: 3, action: 'Payment received', time: '3 hours ago' },
  { id: 4, action: 'New comment on task', time: '5 hours ago' },
];

export default function DashboardPage() {
  const { addToast } = useToast();

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  // Fetch users
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    refetch,
  } = useFetchWithToast<User[]>(() => apiClient.get('/users'), {
    skip: false,
    showErrorToast: true,
    errorTitle: 'Failed to load users',
  });

  // Use fetched users, fallback to empty array
  const displayUsers = fetchedUsers ?? [];

  // Create user mutation
  const { mutate: createUser, isLoading: isCreating } = useMutationWithToast(
    (data?: User) => apiClient.post('/users', data),
    {
      showSuccessToast: true,
      successTitle: 'User Created',
      showErrorToast: true,
      errorTitle: 'Failed to create user',
      onSuccess: () => {
        refetch();
        handleCloseModal();
      },
    },
  );

  // Update user mutation
  const { mutate: updateUser, isLoading: isUpdating } = useMutationWithToast(
    (data?: { id: string; firstName: string; lastName: string; email: string }) =>
      apiClient.patch(`/users/${data?.id}`, {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email
      }),
    {
      showSuccessToast: true,
      successTitle: 'Updated',
      showErrorToast: true,
      errorTitle: 'Failed to update user',
      onSuccess: () => {
        refetch();
        handleCloseModal();
      },
    },
  );

  // Delete user mutation
  const { mutate: deleteUser, isLoading: isDeleting } = useMutationWithToast(
    (id?: string) => apiClient.delete(`/users/${id}`),
    {
      showSuccessToast: true,
      successTitle: 'Deleted',
      showErrorToast: true,
      errorTitle: 'Failed to delete user',
      onSuccess: () => {
        refetch();
      },
    },
  );

  // Form handlers
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      });
    } else {
      setEditingUser(null);
      setFormData({ firstName: '', lastName: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      addToast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'error',
      });
      return;
    }

    if (editingUser) {
      updateUser({
        id: editingUser.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
    } else {
      createUser({
        id: String(Math.random()),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      } as User);
    }
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Complete example with statistics, activity feed, and user management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="bg-primary mt-1 h-2 w-2 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>
              {isLoadingUsers ? 'Loading...' : `Manage ${displayUsers.length} users`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => handleOpenModal()} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
            <Button className="w-full" variant="outline">
              View All Reports
            </Button>
            <Button className="w-full" variant="secondary">
              Download Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          {!isLoadingUsers && (
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users List</CardTitle>
                <CardDescription>Manage your users with full CRUD operations</CardDescription>
              </div>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingUsers && (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          )}
          {!isLoadingUsers && displayUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No users found</p>
              <Button onClick={() => handleOpenModal()}>Create First User</Button>
            </div>
          )}
          {!isLoadingUsers && displayUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-border border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">First Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Last Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user: User) => (
                    <tr key={user.id} className="border-border hover:bg-muted/50 border-b">
                      <td className="px-4 py-3 font-medium">{user.firstName}</td>
                      <td className="px-4 py-3 font-medium">{user.lastName}</td>
                      <td className="text-muted-foreground px-4 py-3">{user.email}</td>
                      <td className="text-muted-foreground px-4 py-3">
                        <span className="bg-muted inline-block rounded px-2 py-1 text-xs">
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleOpenModal(user)}
                            variant="outline"
                            size="sm"
                            disabled={isUpdating || isDeleting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(user.id)}
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Create New User'}
        description={editingUser ? 'Update user information' : 'Add a new user to the system'}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="user-form"
              disabled={isCreating || isUpdating}
              isLoading={isCreating || isUpdating}
            >
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user-first-name" className="mb-1 block text-sm font-medium">
              First Name *
            </label>
            <Input
              id="user-first-name"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="user-last-name" className="mb-1 block text-sm font-medium">
              Last Name *
            </label>
            <Input
              id="user-last-name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="user-email" className="mb-1 block text-sm font-medium">
              Email *
            </label>
            <Input
              id="user-email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
