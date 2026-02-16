import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserForm } from './create-user-form';
import { UserList } from './user-list';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Server Component — runs entirely on the server.
 * No 'use client' directive = data is fetched at request time without client JS.
 */
export default async function ServerExamplePage() {
  // Fetch users from backend API
  let users: User[] = [];
  let error: string | null = null;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/v1/users?page=1&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching for fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: ApiResponse<User[]> = await response.json();
    users = data.data || [];
  } catch (err) {
    console.error('Error fetching users:', err);
    error = err instanceof Error ? err.message : 'Failed to load users';
  }

  const totalUsers = users.length;

  // You can also do async operations directly
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Server Components & Actions</h1>
        <p className="text-muted-foreground mt-2">
          This page demonstrates React Server Components (RSC) and Server Actions patterns.
        </p>
      </div>

      {/* Info Cards — rendered on server, zero client JS */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rendered At (UTC)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{timestamp}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rendering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Server Component</div>
            <p className="text-muted-foreground text-xs">No client JS for this section</p>
          </CardContent>
        </Card>
      </div>

      {/* Server Action Form — progressive enhancement */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Create User (Server Action)</CardTitle>
            <CardDescription>
              This form uses a Server Action. It works even with JavaScript disabled (progressive
              enhancement).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>
      </div>

      {/* User List with Server Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Users (Server-rendered from Backend)</CardTitle>
          <CardDescription>
            This list is fetched from the backend via server component. Delete uses a Server Action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-50 text-red-700 rounded-lg p-4">
              <p className="font-medium">Error loading users</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <UserList users={users} />
          )}
        </CardContent>
      </Card>

      {/* Pattern explanation */}
      <div className="bg-muted mt-8 rounded-lg p-6">
        <h3 className="mb-3 font-semibold">When to use Server Components vs Client Components</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium text-green-600">Server Components (default)</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>- Fetch data directly (DB, API)</li>
              <li>- Access backend resources</li>
              <li>- Keep sensitive data on server</li>
              <li>- Large dependencies (stay on server)</li>
              <li>- Static content rendering</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-blue-600">
              Client Components (&apos;use client&apos;)
            </h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>- Interactivity (onClick, onChange)</li>
              <li>- State (useState, useReducer)</li>
              <li>- Effects (useEffect)</li>
              <li>- Browser APIs (localStorage)</li>
              <li>- Custom hooks with state</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
