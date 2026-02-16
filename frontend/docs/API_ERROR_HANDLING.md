# API Error Handling with Toast

คู่มือการจัดการ API errors พร้อม toast notifications อัตโนมัติ

## 🎯 Overview

ระบบนี้จะช่วยจัดการ API errors โดยอัตโนมัติและแสดง toast notifications ที่เป็นมิตรกับผู้ใช้ โดยไม่ต้องเขียน error handling code ซ้ำๆ ในทุก component

## 📦 Components ที่เกี่ยวข้อง

- **ApiError** - Custom error class สำหรับ API errors
- **parseErrorMessage** - Utility สำหรับแปลง error เป็น user-friendly message
- **useFetchWithToast** - Hook สำหรับ fetch ข้อมูลพร้อม toast error handling
- **useMutationWithToast** - Hook สำหรับ mutations พร้อม toast success/error handling

## 🚀 Quick Start

### 1. ใช้ `useFetchWithToast` สำหรับการดึงข้อมูล

```tsx
'use client';

import { useFetchWithToast } from '@/hooks/use-fetch-with-toast';
import { apiClient } from '@/lib/api-client';

export default function UserProfile({ userId }) {
  const { data, isLoading, error, refetch } = useFetchWithToast(
    () => apiClient.get(`/users/${userId}`),
    {
      showErrorToast: true,
      errorTitle: 'Failed to load user',
    },
  );

  if (isLoading) return <div>Loading...</div>;

  // No need to manually show error toast - it's automatic!
  return <div>{data?.name}</div>;
}
```

### 2. ใช้ `useMutationWithToast` สำหรับการแก้ไขข้อมูล

```tsx
'use client';

import { useMutationWithToast } from '@/hooks/use-fetch-with-toast';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export default function CreateUserButton() {
  const { mutate: createUser, isLoading } = useMutationWithToast(
    (data: { name: string; email: string }) => apiClient.post('/users', data),
    {
      showSuccessToast: true,
      successMessage: 'User created successfully!',
      showErrorToast: true,
      errorTitle: 'Failed to create user',
    },
  );

  const handleClick = () => {
    createUser({
      name: 'John Doe',
      email: 'john@example.com',
    });
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create User'}
    </Button>
  );
}
```

## 📖 API Reference

### `useFetchWithToast`

Hook สำหรับดึงข้อมูลพร้อมแสดง error toast อัตโนมัติ

**Parameters:**

- `fetchFn` - Function ที่ return Promise<ApiResponse<T>>
- `options` - Configuration options

**Options:**

```typescript
{
  skip?: boolean;                // Skip initial fetch
  showSuccessToast?: boolean;    // Show toast on success (default: false)
  successMessage?: string;       // Success toast message
  showErrorToast?: boolean;      // Show toast on error (default: true)
  errorTitle?: string;           // Error toast title (default: 'Error')
  onSuccess?: (data: T) => void; // Callback on success
  onError?: (error: string) => void; // Callback on error
}
```

**Returns:**

```typescript
{
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}
```

### `useMutationWithToast`

Hook สำหรับ mutations พร้อมแสดง success/error toast อัตโนมัติ

**Parameters:**

- `mutationFn` - Function ที่รับ params และ return Promise<ApiResponse<T>>
- `options` - Configuration options

**Options:**

```typescript
{
  showSuccessToast?: boolean;    // Show toast on success (default: true)
  successTitle?: string;         // Success toast title (default: 'Success')
  successMessage?: string;       // Success toast message
  showErrorToast?: boolean;      // Show toast on error (default: true)
  errorTitle?: string;           // Error toast title (default: 'Error')
  onSuccess?: (data: T) => void; // Callback on success
  onError?: (error: string) => void; // Callback on error
}
```

**Returns:**

```typescript
{
  data: T | null;
  error: string | null;
  isLoading: boolean;
  mutate: (params?: P) => Promise<void>;
}
```

### `ApiError` Class

Custom error class สำหรับจัดการ API errors

**Methods:**

- `getUserMessage()` - ได้ user-friendly error message
- `isNetworkError()` - เช็คว่าเป็น network error
- `isValidationError()` - เช็คว่าเป็น validation error (400, 422)
- `isAuthError()` - เช็คว่าเป็น authentication error (401, 403)

**Example:**

```typescript
import { ApiError } from '@/utils/api-error';

try {
  const response = await apiClient.get('/users');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.getUserMessage());
    if (error.isAuthError()) {
      // Redirect to login
    }
  }
}
```

## 🎨 Error Message Mapping

ระบบจะแปลง HTTP status codes เป็น user-friendly messages อัตโนมัติ:

| Status Code | User Message                                             |
| ----------- | -------------------------------------------------------- |
| 400         | Invalid request. Please check your input.                |
| 401         | You are not authorized. Please log in.                   |
| 403         | You do not have permission to perform this action.       |
| 404         | The requested resource was not found.                    |
| 408         | Request timeout. Please try again.                       |
| 409         | This action conflicts with existing data.                |
| 422         | Validation error. Please check your input.               |
| 429         | Too many requests. Please try again later.               |
| 500         | Server error. Please try again later.                    |
| 502, 503    | Service temporarily unavailable. Please try again later. |
| 504         | Gateway timeout. Please try again.                       |

## 💡 Use Cases

### 1. Simple Fetch with Error Toast

```tsx
const { data, isLoading } = useFetchWithToast(() => apiClient.get('/products'), {
  showErrorToast: true,
});
```

### 2. Mutation with Custom Messages

```tsx
const { mutate: deleteItem, isLoading } = useMutationWithToast(
  (id: string) => apiClient.delete(`/items/${id}`),
  {
    successTitle: 'Deleted!',
    successMessage: 'Item has been deleted successfully',
    errorTitle: 'Delete Failed',
  },
);
```

### 3. With Custom Callbacks

```tsx
const { mutate: updateProfile, isLoading } = useMutationWithToast(
  (data: ProfileData) => apiClient.put('/profile', data),
  {
    showSuccessToast: true,
    showErrorToast: true,
    onSuccess: (data) => {
      // Custom logic after success
      router.push('/profile');
    },
    onError: (error) => {
      // Custom error handling
      console.error('Profile update failed:', error);
    },
  },
);
```

### 4. Form Submission with Validation

```tsx
const {
  mutate: submitForm,
  isLoading,
  error,
} = useMutationWithToast((formData: FormData) => apiClient.post('/submit', formData), {
  showSuccessToast: true,
  successMessage: 'Form submitted successfully!',
  showErrorToast: true,
});

const handleSubmit = async (values: FormData) => {
  await submitForm(values);
  // Toast will show automatically based on result
};
```

### 5. Silent Fetch (No Toast)

```tsx
// If you want to handle errors manually
const { data, error } = useFetchWithToast(() => apiClient.get('/data'), {
  showErrorToast: false,
  onError: (error) => {
    // Handle error manually
  },
});
```

## 🧪 Testing

ดูตัวอย่างและทดสอบได้ที่:

```text
http://localhost:3000/api-error-demo
```

หน้านี้มี:

- ตัวอย่างการใช้ `useFetchWithToast`
- ตัวอย่างการใช้ `useMutationWithToast`
- ปุ่มสำหรับทดสอบ error แต่ละประเภท (400, 401, 404, 500, etc.)
- แสดงวิธีการใช้งานจริง

## 📁 ไฟล์ที่เกี่ยวข้อง

```text
src/
├── utils/
│   ├── api-error.ts              # ApiError class และ utilities
│   └── index.ts                  # Export utilities
├── hooks/
│   ├── use-fetch-with-toast.ts   # Hooks พร้อม toast handling
│   ├── use-fetch.ts              # Base fetch hooks
│   └── index.ts                  # Export hooks
├── lib/
│   └── api-client.ts             # API client (Axios)
└── app/
    ├── api-error-demo/
    │   └── page.tsx              # Demo page
    └── api/
        └── test-error/
            └── route.ts          # Test API for simulating errors
```

## 🔄 Migration from Old Code

**Before:**

```tsx
const { data, error, isLoading } = useFetch(() => apiClient.get('/users'));

useEffect(() => {
  if (error) {
    addToast({
      title: 'Error',
      description: error,
      variant: 'error',
    });
  }
}, [error, addToast]);
```

**After:**

```tsx
const { data, isLoading } = useFetchWithToast(() => apiClient.get('/users'), {
  showErrorToast: true,
});
// That's it! No manual error handling needed
```

## 🎯 Best Practices

1. **ใช้ `useFetchWithToast` สำหรับการดึงข้อมูล** - Error toast จะแสดงอัตโนมัติ
2. **ใช้ `useMutationWithToast` สำหรับการแก้ไขข้อมูล** - ได้ทั้ง success และ error toast
3. **ปรับแต่ง messages** - ใช้ `successMessage` และ `errorTitle` ที่เหมาะสม
4. **ใช้ callbacks เมื่อจำเป็น** - `onSuccess` และ `onError` สำหรับ logic เพิ่มเติม
5. **ปิด toast เมื่อไม่ต้องการ** - ตั้ง `showErrorToast: false` หากต้องการจัดการเอง

## 🌈 Features

- ✅ แสดง toast อัตโนมัติเมื่อเกิด error
- ✅ User-friendly error messages ตาม HTTP status code
- ✅ รองรับทั้ง fetch และ mutation
- ✅ Customizable toast messages
- ✅ Type-safe with TypeScript
- ✅ Dark mode support
- ✅ ไม่ต้องเขียน error handling ซ้ำๆ

## 📝 Notes

- Error toast จะแสดง 7 วินาที (เพิ่มกว่า default 5 วินาที เพื่อให้อ่านข้อความ error ได้)
- Success toast ใช้ระยะเวลา default 5 วินาที
- สามารถใช้ hooks เดิม (`useFetch`, `useMutation`) ได้ถ้าไม่ต้องการ toast
- ApiError class มี methods เพิ่มเติมสำหรับเช็คประเภทของ error

---

สร้างโดย: GitHub Copilot
วันที่: 14 กุมภาพันธ์ 2026
