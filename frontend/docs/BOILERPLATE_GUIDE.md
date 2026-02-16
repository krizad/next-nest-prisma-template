# 🚀 Next.js Boilerplate Guide

Complete guide for using this production-ready Next.js template with React, TypeScript, and Tailwind CSS.

## 📋 Table of Contents

1. [Quick Setup](#quick-setup)
2. [Project Structure](#project-structure)
3. [Components](#components)
4. [API Routes](#api-routes)
5. [Error Handling](#error-handling)
6. [Hooks & Utilities](#hooks--utilities)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Deployment](#deployment)

---

## Quick Setup

### Installation

```bash
# Clone or use as template
git clone <repo-url>
cd next-template

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the result.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run check        # Run lint, typecheck, and format check
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes group
│   ├── api/               # API routes
│   │   ├── users/         # User endpoints
│   │   └── test-error/    # Error testing
│   ├── components-demo/   # UI components example
│   ├── advanced-modals/   # Complex modal patterns
│   ├── crud-example/      # CRUD operations example
│   ├── api-error-demo/    # Error handling example
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
│
├── components/            # React components
│   ├── common/           # Shared components (navbar, footer)
│   └── ui/               # UI components (button, modal, toast)
│
├── features/             # Feature-specific logic
│   ├── auth/            # Authentication
│   ├── user/            # User features
│   └── user-profile/    # Profile features
│
├── hooks/                # Custom React hooks
│   ├── use-fetch.ts
│   ├── use-fetch-with-toast.ts
│   ├── use-modal.ts
│   └── use-local-storage.ts
│
├── lib/                  # Utilities & helpers
│   └── api-client.ts    # Axios-based API client
│
├── store/               # State management (Zustand)
│   └── user-store.ts
│
├── types/               # TypeScript types
│   ├── api.ts
│   ├── user.ts
│   └── index.ts
│
└── utils/               # Utility functions
    ├── api-error.ts
    ├── cn.ts           # Class name merging
    └── format.ts       # Formatting utilities
```

---

## Components

### Button Component

```tsx
import { Button } from '@/components/ui/button';

// Variants: primary, secondary, outline, ghost, destructive
<Button variant="primary">Click me</Button>

// Sizes: sm, md, lg
<Button size="lg">Large Button</Button>

// Loading state
<Button isLoading>Loading...</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Modal Component

```tsx
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Modal description"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        }
      >
        {/* Content goes here */}
      </Modal>
    </>
  );
}
```

**Modal Sizes:** `sm`, `md` (default), `lg`, `xl`, `full`

### Toast Notifications

```tsx
import { useToast } from '@/components/ui/toast-provider';

export function MyComponent() {
  const { addToast } = useToast();

  const handleClick = () => {
    addToast({
      title: 'Success!',
      description: 'Operation completed successfully',
      variant: 'success', // default, success, error, warning, info
      duration: 5000, // milliseconds, 0 for infinite
    });
  };

  return <Button onClick={handleClick}>Show Toast</Button>;
}
```

**Toast Variants:** `default`, `success`, `error`, `warning`, `info`

### Input Component

```tsx
import { Input } from '@/components/ui/input';

// Basic input
<Input placeholder="Enter text..." />

// With type
<Input type="email" placeholder="your@email.com" />

// Disabled
<Input disabled />

// With value
<Input defaultValue="Some text" />
```

---

## API Routes

### Creating API Endpoints

Create files in `src/app/api/` directory:

```typescript
// src/app/api/users/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        code: 'FETCH_FAILED',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
        },
        { status: 422 },
      );
    }

    // Create resource
    return NextResponse.json(
      {
        success: true,
        data: { id: '1', ...body },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        code: 'CREATE_FAILED',
      },
      { status: 500 },
    );
  }
}
```

### Dynamic Route Parameters

```typescript
// src/app/api/users/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // Use id to fetch specific resource
  return NextResponse.json({ success: true, data: { id } });
}
```

### Error Status Codes

| Code | Meaning       | When to Use                     |
| ---- | ------------- | ------------------------------- |
| 200  | OK            | Successful GET, PUT, PATCH      |
| 201  | Created       | Successful POST                 |
| 204  | No Content    | Successful DELETE               |
| 400  | Bad Request   | Invalid input/parameters        |
| 401  | Unauthorized  | Missing/invalid authentication  |
| 403  | Forbidden     | Authenticated but not permitted |
| 404  | Not Found     | Resource doesn't exist          |
| 422  | Unprocessable | Validation error                |
| 409  | Conflict      | Duplicate/conflicting data      |
| 429  | Rate Limit    | Too many requests               |
| 500  | Server Error  | Unexpected error                |
| 503  | Unavailable   | Service down                    |

---

## Error Handling

### API Client with Error Handling

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const result = await apiClient.get('/users');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// POST request
const result = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

### Automatic Error Handling with Hooks

```typescript
import { useFetchWithToast } from '@/hooks/use-fetch-with-toast';

// Fetch hook with automatic error toast
const { data, isLoading, error, refetch } = useFetchWithToast(() => apiClient.get('/users'), {
  skip: false, // Skip initial fetch if true
  showErrorToast: true,
  errorTitle: 'Failed to load users',
});

// Mutation hook with success/error toasts
const { mutate, isLoading: isMutating } = useMutationWithToast(
  (data) => apiClient.post('/users', data),
  {
    showSuccessToast: true,
    successTitle: 'User Created',
    successMessage: 'New user added successfully',
    showErrorToast: true,
    errorTitle: 'Failed to create user',
  },
);

// Use mutation
mutate({ name: 'Jane Doe', email: 'jane@example.com' }, () => {
  // Optional: called on success
  console.log('User created!');
});
```

### Custom Error Handling

```typescript
import { ApiError } from '@/utils/api-error';

try {
  const response = await apiClient.get('/users');
  if (!response.success) {
    throw new ApiError(response.error);
  }
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.getUserMessage()); // User-friendly message
    console.log(error.statusCode); // HTTP status

    if (error.isValidationError()) {
      // Handle validation error
    }
    if (error.isNetworkError()) {
      // Handle network error
    }
  }
}
```

---

## Hooks & Utilities

### Custom Hooks

#### `useFetch()`

Fetch data with loading and error states.

```typescript
const { data, isLoading, error, refetch } = useFetch(() => apiClient.get('/users'), {
  skip: false,
});
```

#### `useFetchWithToast()`

Fetch data with automatic error toast notifications.

```typescript
const { data, isLoading } = useFetchWithToast(() => apiClient.get('/users'), {
  showErrorToast: true,
});
```

#### `useMutationWithToast()`

Mutate data with success and error toast notifications.

```typescript
const { mutate, isLoading } = useMutationWithToast((data) => apiClient.post('/users', data), {
  showSuccessToast: true,
  showErrorToast: true,
});
```

#### `useModal()`

Manage modal state.

```typescript
const { isOpen, open, close } = useModal();

// Use in component
<Modal isOpen={isOpen} onClose={close}>
  Content
</Modal>
<Button onClick={open}>Open Modal</Button>
```

#### `useLocalStorage()`

Persist state to localStorage.

```typescript
const [value, setValue] = useLocalStorage('key', 'default');
// Auto-syncs with localStorage
```

### Utility Functions

#### `cn()` - Class Name Merging

Safely merge Tailwind CSS classes.

```typescript
import { cn } from '@/utils/cn';

const classes = cn('px-4 py-2', 'bg-blue-500', condition && 'text-white');
```

#### `format` - Formatting Utilities

Format dates, numbers, etc.

```typescript
import { formatDate, formatCurrency } from '@/utils/format';

formatDate(new Date()); // "January 15, 2024"
formatCurrency(99.99); // "$99.99"
```

---

## Best Practices

### 1. **Component Structure**

```typescript
// ✅ Good: Clear, focused component
export function UserList() {
  const { data, isLoading } = useFetchWithToast(
    () => apiClient.get('/users')
  );

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {data?.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}

// ❌ Avoid: Mixed concerns
export function UserList() {
  // API logic mixed with UI logic
}
```

### 2. **Error Messages**

```typescript
// ✅ User-friendly error messages
addToast({
  title: 'Cannot Save Changes',
  description: 'Please check your internet connection and try again.',
  variant: 'error',
});

// ❌ Avoid: Technical error messages
addToast({
  title: 'Error',
  description: 'ECONNREFUSED: Connection refused',
});
```

### 3. **Loading States**

```typescript
// ✅ Show loading and disabled states
<Button isLoading={isLoading} disabled={isLoading}>
  Save Changes
</Button>

// ❌ Avoid: No indication of loading
<Button>Save Changes</Button>
```

### 4. **Form Validation**

```typescript
// ✅ Validate before submission
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !validateEmail(email)) {
    addToast({
      title: 'Invalid Email',
      description: 'Please enter a valid email address.',
      variant: 'error',
    });
    return;
  }

  mutate({ email });
};

// ❌ Avoid: Unvalidated form submissions
const handleSubmit = () => {
  mutate({ email });
};
```

### 5. **API Response Handling**

```typescript
// ✅ Consistent response structure
{
  success: true,
  data: { /* ... */ },
  message?: string,
  pagination?: { page, limit, total, pages }
}

// Error response
{
  success: false,
  error: 'User-friendly error message',
  code: 'VALIDATION_ERROR',
  details?: unknown
}
```

---

## Common Patterns

### CRUD Example

```typescript
'use client';

import { useState } from 'react';
import { useFetchWithToast, useMutationWithToast } from '@/hooks/use-fetch-with-toast';
import { apiClient } from '@/lib/api-client';

export function UserManager() {
  const [users, setUsers] = useState([]);

  // Read
  const { data: fetchedUsers } = useFetchWithToast(
    () => apiClient.get('/users'),
    { skip: false }
  );

  // Create
  const { mutate: createUser } = useMutationWithToast(
    (data) => apiClient.post('/users', data),
    { showSuccessToast: true, showErrorToast: true }
  );

  // Update
  const { mutate: updateUser } = useMutationWithToast(
    (data) => apiClient.put(`/users/${data.id}`, data),
    { showSuccessToast: true }
  );

  // Delete
  const { mutate: deleteUser } = useMutationWithToast(
    (id) => apiClient.delete(`/users/${id}`),
    { showSuccessToast: true }
  );

  return (
    <div>
      {/* Render UI */}
    </div>
  );
}
```

### Form with Modal

```typescript
export function UserFormModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { mutate, isLoading } = useMutationWithToast(
    (data) => apiClient.post('/users', data)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData, () => {
      onClose();
      setFormData({ name: '', email: '' });
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New User">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Button type="submit" isLoading={isLoading}>
          Create User
        </Button>
      </form>
    </Modal>
  );
}
```

---

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local` for development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Add other variables
NEXT_PUBLIC_SENTRY_DSN=...
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker Deployment

```dockerfile
# See Dockerfile in repository
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com)

---

## 🤝 Contributing

Feel free to customize this template for your needs. The structure is designed to be flexible and scalable.

### Customization Tips

1. **Add new pages**: Create files in `src/app/`
2. **Add new components**: Create in `src/components/`
3. **Add new API routes**: Create in `src/app/api/`
4. **Add new hooks**: Create in `src/hooks/`
5. **Modify styles**: Edit `src/app/globals.css` or component classes

---

## 📝 License

This template is open source and available under the MIT License.

---

**Happy coding! 🚀**
