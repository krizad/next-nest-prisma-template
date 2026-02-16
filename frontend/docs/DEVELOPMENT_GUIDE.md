# 📚 Development Guide

Advanced guide for developers working with this Next.js template.

## 🏗️ Architecture Overview

```
Feature-Based Architecture
├── Pages (src/app/)
├── Features (Business Logic)
│   └── user-profile/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── Shared UI (src/components/)
├── Common (Navbar, Footer, Layout)
├── Hooks (src/hooks/)
├── State (Zustand, src/store/)
├── Types (TypeScript, src/types/)
├── Utils (Helpers, src/utils/)
└── Config (API Client, src/lib/)
```

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Example Test File

```typescript
// src/components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 📦 Working with Dependencies

### Add a Package

```bash
npm install package-name
# or with specific version
npm install package-name@1.2.3
```

### Remove a Package

```bash
npm uninstall package-name
```

### Update All Packages

```bash
npm update
```

### Security Audit

```bash
npm audit
npm audit fix
```

## 🔍 Code Quality

### ESLint

Check for issues:

```bash
npm run lint
```

Fix automatically:

```bash
npm run lint:fix
```

### TypeScript

Check types:

```bash
npm run typecheck
```

### Prettier

Format code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

### Full Check

```bash
npm run check  # Runs lint + typecheck + format:check
```

## 🚀 Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Analyze Bundle

```bash
npm run build
npm run analyze  # If webpack-bundle-analyzer is installed
```

## 🐛 Debugging

### Browser DevTools

Open DevTools (`F12` or `Cmd+Option+I`) in your browser.

### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Console Logging

```typescript
console.log('Debug:', data);
console.warn('Warning:', error);
console.error('Error:', error);
```

## 📝 Code Patterns

### API Service Pattern

```typescript
// src/features/my-feature/services/my-service.ts
import { apiClient } from '@/lib/api-client';
import type { MyType } from '../types';

export async function fetchMyData(): Promise<MyType> {
  const response = await apiClient.get<MyType>('/my-endpoint');
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
}
```

### Custom Hook Pattern

```typescript
// src/features/my-feature/hooks/use-my-feature.ts
'use client';
import { useFetch } from '@/hooks';
import { fetchMyData } from '../services/my-service';

export function useMyFeature() {
  return useFetch(() => fetchMyData());
}
```

### Component Pattern

```typescript
// src/features/my-feature/components/my-component.tsx
'use client';
import { useMyFeature } from '../hooks/use-my-feature';

export function MyComponent() {
  const { data, isLoading, error } = useMyFeature();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render data */}</div>;
}
```

## 🌍 Environment Variables

### Public Variables (Exposed to Browser)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
```

Access in code:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### Private Variables (Server-Side Only)

```bash
DATABASE_URL=postgresql://...
SECRET_KEY=xxx
```

Access in API routes only:

```typescript
// src/app/api/my-route/route.ts
const dbUrl = process.env.DATABASE_URL;
```

## 🔒 Security Best Practices

1. **Never expose secrets** - Use private env variables
2. **Validate inputs** - Always validate user input
3. **Sanitize outputs** - Prevent XSS attacks
4. **Use HTTPS** - In production only
5. **CORS configuration** - Restrict API access
6. **Rate limiting** - Prevent abuse
7. **Error handling** - Don't leak sensitive info

Example error handling:

```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Process data
    return Response.json({ success: true });
  } catch (error) {
    console.error('Internal error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 🎯 Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image';

export function MyImage() {
  return <Image src="/path/to/image.jpg" alt="Description" width={800} height={600} priority />;
}
```

### Code Splitting

Next.js automatically code-splits at page boundaries. For custom splitting:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <div>Loading...</div>,
});
```

### Lazy Loading

```typescript
'use client';
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./lazy-component'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 📊 Monitoring

### Error Tracking (Sentry Example)

Install and init:

```bash
npm install @sentry/nextjs
```

Wrap your app:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

Use Next.js Web Analytics:

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Add to layout:

```tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Layout() {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

## 🤝 Git Workflow

### Feature Branch

```bash
git checkout -b feature/my-feature
```

### Commit

```bash
git add .
git commit -m "feat: add my feature"
```

### Push

```bash
git push origin feature/my-feature
```

### Pull Request

- Create PR on GitHub
- Request reviewers
- Wait for CI/CD to pass
- Merge when approved

---

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4)
- [Zustand Guide](https://github.com/pmndrs/zustand)
