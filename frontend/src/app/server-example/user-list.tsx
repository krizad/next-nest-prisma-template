'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteUserAction } from './actions';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export function UserList({ users }: Readonly<{ users: User[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.success) {
        // Revalidate the page to get fresh data from the server
        router.refresh();
      }
    });
  };

  if (users.length === 0) {
    return <p className="text-muted-foreground py-4 text-center text-sm">No users found.</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="border-border flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-muted rounded px-2 py-1 text-xs">{user.role}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(user.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
