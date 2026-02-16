# API Integration Guide

บน template นี้ได้แสดงตัวอย่างการใช้ API integration แบบสมบูรณ์ มีส่วนประกอบทั้งหมด:

**โครงสร้าง** ใช้ **axios** เป็นพื้นฐาน แทน fetch API ของเบราวเซอร์

## 🏗️ Architecture ที่เตรียมไว้

```text
API Request → apiClient (error handling + timeout)
    ↓
Service layer (authService, userService)
    ↓
Hooks (useFetch, useMutation - handles state)
    ↓
Components (ตอบสนองต่อ loading/error)
```

## 📦 Components ที่มี

### 1. Enhanced apiClient

ตั้งอยู่: [src/lib/api-client.ts](src/lib/api-client.ts)

Built with axios for better control and interceptor support.

**Features:**

- Built on **axios** (better request/response interceptors)
- Automatic error handling
- Request timeout (default 30s)
- Support GET, POST, PUT, PATCH, DELETE
- Type-safe responses
- Easy header management (`setHeader`, `removeHeader`)
- Access raw axios instance if needed

**Usage:**

```typescript
const response = await apiClient.get('/users');
const response = await apiClient.post('/auth/login', { email, password });

// Set auth header
apiClient.setHeader('Authorization', `Bearer ${token}`);

// Access raw axios instance for advanced usage
const instance = apiClient.getInstance();
```

### 2. Service Layer

ตั้งอยู่: `src/features/*/services/`

**Auth Service** - [src/features/auth/services/auth-service.ts](src/features/auth/services/auth-service.ts)

- `login(credentials)` - POST /api/auth/login
- `register(data)` - POST /api/auth/register
- `logout()` - POST /api/auth/logout
- `getCurrentUser()` - GET /api/auth/me
- `refreshToken()` - POST /api/auth/refresh

**User Service** - [src/features/user/services/user-service.ts](src/features/user/services/user-service.ts)

- `getUsers(query)` - GET /api/users with pagination
- `getUserById(id)` - GET /api/users/:id
- `updateUser(id, data)` - PATCH /api/users/:id
- `createUser(data)` - POST /api/users
- `deleteUser(id)` - DELETE /api/users/:id

### 3. Fetch Hooks

ตั้งอยู่: [src/hooks/use-fetch.ts](src/hooks/use-fetch.ts)

**useFetch** - สำหรับ query/read

```typescript
const { data, isLoading, error, refetch } = useFetch(() => userService.getUsers(), {
  skip: false,
  onSuccess: (data) => console.log(data),
  onError: (error) => console.error(error),
});
```

**useMutation** - สำหรับ POST/PUT/DELETE

```typescript
const { mutate, isLoading, error } = useMutation((params) => authService.login(params), {
  onSuccess: (data) => console.log('Success!', data),
  onError: (error) => console.error(error),
});

// ใช้
await mutate({ email: 'test@example.com', password: '123' });
```

### 4. Demo Page

ตั้งอยู่: [src/app/api-sandbox/page.tsx](src/app/api-sandbox/page.tsx)

ดูโดยเปิด: [http://localhost:3000/api-sandbox](http://localhost:3000/api-sandbox)

- Demo การใช้ `useFetch` (GET)
- Demo การใช้ `useMutation` (POST)
- ตัวอย่าง code pattern

## 🔧 วิธีใช้ในโปรเจกต์จริง

### Step 1: สร้าง Service

```typescript
// src/features/posts/services/post-service.ts
import { apiClient } from '@/lib/api-client';
import { type Post } from '../types';

export const postService = {
  async getPosts() {
    return apiClient.get<Post[]>('/posts');
  },
  async createPost(data: Omit<Post, 'id'>) {
    return apiClient.post<Post>('/posts', data);
  },
};
```

### Step 2: ใช้ Hook ใน Component

```typescript
'use client';

import { useFetch, useMutation } from '@/hooks';
import { postService } from '@/features/posts/services/post-service';

export function PostsPage() {
  // สำหรับ fetch
  const { data: posts, isLoading } = useFetch(
    () => postService.getPosts()
  );

  // สำหรับ mutation
  const { mutate: createPost } = useMutation(
    (data) => postService.createPost(data),
    { onSuccess: () => alert('Created!') }
  );

  return (
    // Render based on isLoading, error states
  );
}
```

## 🌍 Environment Variables

จัดเตรียมให้ใน `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_TIMEOUT=30000
```

วนไป `apiClient` constructor เพื่อใช้:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
export const apiClient = new ApiClient(baseUrl);
```

## 📋 Best Practices

1. **ใช้ Services เสมอ** — ห้ามเรียก `apiClient` โดยตรงจาก components
2. **ใช้ Type Safety** — สร้าง types ใน `features/[feature]/types.ts`
3. **Handle Errors** — ใช้ `onError` callback ใน hooks
4. **Refetch Pattern** — ให้ refetch ใช้ custom state/Zustand ถ้าต้องการ cache
5. **Timeout Protection** — apiClient ตั้งค่าไว้ 30s แล้ว

## 🎯 ตัวอย่างทั้งหมด

- [API Sandbox](src/app/api-sandbox/page.tsx) — Interactive demo
- [Auth Service](src/features/auth/services/auth-service.ts) — Authentication example
- [User Service](src/features/user/services/user-service.ts) — CRUD example
- [Use Fetch Hook](src/hooks/use-fetch.ts) — Query & mutation hooks

## สองอย่างที่อยากเสริม?

- **State Management (Zustand)** — เลือก refetch pattern ให้พร้อม
- **Retry Logic** — เพิ่ม exponential backoff

---

Happy coding! 🚀
