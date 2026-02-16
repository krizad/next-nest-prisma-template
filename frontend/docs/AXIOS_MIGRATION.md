# Axios Migration Guide

Template นี้เปลี่ยนมาใช้ **axios** แทน fetch API ของเบราวเซอร์

## ✅ ทำไมต้อง Axios?

| Feature           | Fetch           | Axios        |
| ----------------- | --------------- | ------------ |
| Interceptors      | ❌              | ✅           |
| Request timeout   | Manual          | Built-in     |
| Error handling    | Verbose         | Clean        |
| Header management | Manual          | Easy         |
| Cancel requests   | AbortController | Cancel token |
| JSON transform    | Manual          | Auto         |

## 📦 Installation

Dependencies ที่เพิ่มไป:

```bash
npm install axios
```

ตรวจสอบ `package.json`:

```json
{
  "dependencies": {
    "axios": "^1.8.1"
  }
}
```

## 🔧 What Changed

### Before (Fetch API)

```typescript
const response = await fetch('/api/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  signal: abortController.signal, // manual timeout
});
const data = await response.json();
if (!response.ok) throw new Error(data.message);
```

### After (Axios)

```typescript
const response = await apiClient.get('/users');
// Error handling + timeout built-in
// Response type is automatically ApiResponse<T>
```

## 📋 API Client Features

### Basic Methods

```typescript
await apiClient.get('/users');
await apiClient.post('/users', { name: 'John' });
await apiClient.put('/users/1', { name: 'Jane' });
await apiClient.patch('/users/1', { active: true });
await apiClient.delete('/users/1');
```

### Header Management

```typescript
// Set auth token
apiClient.setHeader('Authorization', `Bearer ${token}`);

// Remove header
apiClient.removeHeader('Authorization');
```

### Advanced (Raw Axios)

```typescript
const instance = apiClient.getInstance();

// Add custom interceptor
instance.interceptors.request.use((config) => {
  // modify request
  return config;
});
```

## 📝 Examples

### Setting up Authentication

```typescript
// In your auth service
async function login(email: string, password: string) {
  const response = await authService.login({ email, password });

  if (response.success) {
    const token = response.data.token;
    // Set auth header for all future requests
    apiClient.setHeader('Authorization', `Bearer ${token}`);
    localStorage.setItem('token', token);
  }
}

// On app load, restore token
function restoreAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    apiClient.setHeader('Authorization', `Bearer ${token}`);
  }
}
```

### Custom Error Handling

```typescript
const response = await apiClient.post('/data', {
  /* ... */
});

if (response.success) {
  console.log('Success:', response.data);
} else {
  // axios errors are caught and formatted
  console.error('Error:', response.error);
}
```

## 🔗 Files Changed

- `package.json` — Added axios
- `src/lib/api-client.ts` — Rewritten to use axios
- `docs/API_INTEGRATION.md` — Updated documentation

## ✨ All Services Still Work

ไม่ต้องเปลี่ยนแปลง:

- `src/features/auth/services/auth-service.ts`
- `src/features/user/services/user-service.ts`
- `src/hooks/use-fetch.ts`
- All components using services

---

**That's it!** Run `npm install` and you're good to go 🚀
