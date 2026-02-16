# 🎨 Customization Guide

คู่มือสำหรับปรับแต่ง Next.js Template ให้เป็นโปรเจกต์ของคุณเอง

## 🏷️ Step 1: Basic Project Info

### Update `package.json`

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "My awesome application",
  "author": "Your Name",
  "license": "MIT"
}
```

### Update `src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: 'My App',
  description: 'My app description',
  keywords: 'keyword1, keyword2',
  openGraph: {
    title: 'My App',
    description: 'My app description',
    url: 'https://myapp.com',
    type: 'website',
  },
};
```

---

## 🎨 Step 2: Branding & Styling

### Colors & Theme

Edit `src/app/globals.css`:

```css
@theme {
  --color-primary: #YOUR_COLOR;
  --color-secondary: #YOUR_COLOR;
  --color-accent: #YOUR_COLOR;
}
```

### Navigation (Navbar)

Edit `src/components/common/navbar.tsx`:

```tsx
- Logo / App Name
- Navigation Links (Home, Dashboard, Profile, Settings)
- Theme Toggle
- User Menu (Optional)
```

### Footer

Edit `src/components/common/footer.tsx`:

```tsx
- Copyright info
- Links (Privacy, Terms, Docs)
- Social media
```

---

## 📝 Step 3: API Configuration

### Setup Base URL

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# or
NEXT_PUBLIC_API_BASE_URL=https://api.myapp.com
```

### Update API Client

Edit `src/lib/api-client.ts`:

```typescript
// Change base URL if needed
const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL);
```

### Add API Endpoints

Create API routes in `src/app/api/`:

```bash
src/app/api/
├── users/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── posts/
│   └── route.ts
└── auth/
    └── route.ts
```

---

## 🧩 Step 4: Features & Pages

### Create a New Feature

```bash
# Example: Create a "products" feature
mkdir -p src/features/products

# Structure
src/features/products/
├── components/
│   ├── product-card.tsx
│   ├── product-list.tsx
│   └── index.ts
├── hooks/
│   └── use-products.ts
├── services/
│   └── product-service.ts
├── types.ts
└── index.ts
```

### Create Pages

```bash
# Page with layout
mkdir -p src/app/products
# Create file: src/app/products/page.tsx

# Page with URL params
mkdir -p src/app/products/[id]
# Create file: src/app/products/[id]/page.tsx
```

---

## 🔐 Step 5: Authentication

### Setup Auth Pages

Already available at:

- `/login` → `src/app/(auth)/login/page.tsx`
- `/register` → `src/app/(auth)/register/page.tsx`

### Implement Auth Logic

Update `src/features/auth/`:

```typescript
// src/features/auth/services/auth-service.ts
export async function login(email: string, password: string) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

export async function logout() {
  useUserStore.getState().logout();
}
```

### Protect Routes

Create middleware in `src/app/_middleware.ts` (optional):

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth_token');

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
};
```

---

## 🎯 Step 6: UI Components

### Customize UI Components

Located in `src/components/ui/`:

- `button.tsx` - Button styles
- `input.tsx` - Input field styles
- `card.tsx` - Card component
- `modal.tsx` - Modal dialog
- `toast.tsx` - Toast notifications

Example - Customize Button:

```tsx
// src/components/ui/button.tsx
export function Button({ variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-200 text-black',
    danger: 'bg-red-600 text-white',
  };

  return <button className={variants[variant]} {...props} />;
}
```

### Add New Components

```bash
mkdir -p src/components/ui/new-component
# Create: src/components/ui/new-component.tsx
```

---

## 📊 Step 7: State Management

### Using Zustand

```typescript
// src/store/my-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'my-store',
    },
  ),
);
```

Usage in a component:

```tsx
'use client';
import { useMyStore } from '@/store/my-store';

export function Counter() {
  const { count, increment } = useMyStore();
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </>
  );
}
```

---

## 🎣 Step 8: Custom Hooks

### Create a Custom Hook

```typescript
// src/hooks/use-my-hook.ts
import { useCallback, useState } from 'react';

export function useMyHook(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, setValue, reset };
}
```

Use it:

```tsx
import { useMyHook } from '@/hooks';

export function MyComponent() {
  const { value, setValue } = useMyHook('default');

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

---

## 📘 Step 9: TypeScript Types

### Add Global Types

```typescript
// src/types/custom.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ApiError {
  code: string;
  message: string;
}
```

Export from `src/types/index.ts`:

```typescript
export * from './api';
export * from './user';
export * from './custom';
```

---

## 🛠️ Step 10: Environment Variables

### Setup Environment Files

1. `.env.example` - Template for all variables
2. `.env.local` - Local development variables (git ignored)
3. `.env.production` - Production variables (if needed)

Example `.env.local`:

```bash
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# External Services
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
NEXT_PUBLIC_MAPBOX_TOKEN=pk_xxx

# Internal
DATABASE_URL=postgresql://user:pass@localhost/dbname
NEXT_SECRET_API_KEY=secret_xxx
```

---

## 🚀 Step 11: Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

---

## ✅ Pre-Launch Checklist

- [ ] Update `package.json` name & description
- [ ] Update metadata in `layout.tsx`
- [ ] Customize Navbar & Footer
- [ ] Set up `.env.local`
- [ ] Configure API endpoints
- [ ] Update theme colors in `globals.css`
- [ ] Remove demo pages (if needed)
- [ ] Test all routes
- [ ] Run `npm run check` to ensure code quality
- [ ] Run `npm run build` to test production build
- [ ] Test dark/light theme toggle
- [ ] Check mobile responsiveness
- [ ] Set up analytics (if needed)
- [ ] Configure SEO metadata
- [ ] Set up error tracking (e.g., Sentry)

---

## 🎯 Tips & Best Practices

1. **Keep components small** - One responsibility per component
2. **Use TypeScript** - Type everything for better IDE support
3. **Create feature folders** - Organize code by features, not file types
4. **Use custom hooks** - Logic is reusable via hooks
5. **Centralize API calls** - Keep all API logic in services
6. **Use Zustand stores** - For complex global state
7. **Test your code** - Especially API integration
8. **Monitor performance** - Use Next.js perfomance tools
9. **Keep dependencies updated** - Run `npm audit` regularly
10. **Document your code** - Comments for complex logic

---

Happy customizing! 🎉
