# ⚡ Quick Reference

Super quick cheat sheet for common tasks.

## 🚀 Getting Started

```bash
# Clone & setup
git clone <repo>
cd next-template
npm install
npm run dev
# Visit http://localhost:3000
```

## 📝 Common Commands

### Using NPM

| Command            | Purpose                 |
| ------------------ | ----------------------- |
| `npm run dev`      | Start dev server        |
| `npm run build`    | Build for production    |
| `npm run lint:fix` | Fix linting issues      |
| `npm run check`    | Full code quality check |

### Using Make (Recommended - Faster!)

| Command         | Purpose                     |
| --------------- | --------------------------- |
| `make dev`      | Start dev server            |
| `make build`    | Build for production        |
| `make lint-fix` | Fix linting issues          |
| `make check`    | Full code quality check     |
| `make install`  | Install dependencies        |
| `make clean`    | Clean cache & build files   |
| `make help`     | Show all available commands |

💡 **Tip:** Type `make` to see all available Make commands!

## 📁 Create New...

### Page

```bash
mkdir -p src/app/my-page
# File: src/app/my-page/page.tsx
export default function MyPage() {
  return <h1>My Page</h1>;
}
```

### API Endpoint

```bash
# File: src/app/api/my-endpoint/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello' });
}
```

### Component

```bash
# File: src/components/my-component.tsx
export function MyComponent() {
  return <div>Component</div>;
}
```

### Feature Module

```bash
mkdir -p src/features/my-feature/{components,hooks,services}
# Add types.ts and index.ts
```

### Custom Hook

```bash
# File: src/hooks/use-my-hook.ts
export function useMyHook() {
  // Hook logic
  return {};
}
```

## 🧠 State Management (Zustand)

```typescript
import { create } from 'zustand';

export const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

Usage: `const { count, increment } = useMyStore();`

## 🔌 API Calls

```typescript
import { apiClient } from '@/lib/api-client';

// GET
const response = await apiClient.get('/endpoint');

// POST
const response = await apiClient.post('/endpoint', { data });

// PUT/PATCH/DELETE
const response = await apiClient.put('/endpoint', { data });
```

## 🎣 useEffect Pattern

```typescript
useEffect(() => {
  // Do something
  return () => {
    // Cleanup
  };
}, [dependency]); // Run when dependency changes
```

## 🎨 Tailwind Classes

```tsx
// Spacing
<div className="p-4 m-2">Padding 4, Margin 2</div>

// Colors
<div className="bg-blue-600 text-white">Blue background, white text</div>

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">Full on mobile, half on tablet, thirds on desktop</div>

// Flexbox
<div className="flex gap-4 items-center justify-between">Column layout</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">Grid layout</div>
```

## 🔐 Environment Variables

### Public (visible in browser)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Private (server only)

```bash
DATABASE_URL=postgresql://...
SECRET_KEY=xxx
```

Access:

```typescript
const url = process.env.NEXT_PUBLIC_API_BASE_URL;
const secret = process.env.SECRET_KEY; // API routes only
```

## 🧪 Data Fetching Hook

```typescript
const { data, isLoading, error } = useFetch(() => apiClient.get('/endpoint'));
```

## 🚨 Error Handling

```typescript
try {
  const result = await apiClient.get('/endpoint');
  if (result.success) {
    console.log(result.data);
  } else {
    console.error(result.error);
  }
} catch (error) {
  console.error('Failed:', error.message);
}
```

## 🎯 TypeScript Tips

```typescript
// Define types
interface User {
  id: string;
  name: string;
  email: string;
}

// Use in components
function UserProfile({ user }: { user: User }) {
  return <p>{user.name}</p>;
}
```

## 🌙 Dark Mode

```tsx
// Component is automatically themed
// Light/dark theme is handled by next-themes

// To get theme in 'use client' component:
'use client';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
  );
}
```

## 📱 Responsive Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Usage: `md:w-1/2` (width 50% on medium screens and up)

## 🔗 File Organization

```
src/
├── app/              // Pages & API routes
├── components/       // UI Components
├── features/         // Business logic (by feature)
├── hooks/            // Custom hooks
├── lib/              // Config & clients
├── store/            // Zustand stores
├── types/            // TypeScript types
└── utils/            // Helper functions
```

## 🧹 Code Quality

```bash
npm run lint      # Check issues
npm run lint:fix  # Auto fix
npm run format    # Format code
npm run typecheck # Type checking
```

## 🚀 Deployment

```bash
# Build
npm run build

# Start production server
npm start

# Or deploy to Vercel
# Git push → Auto deploy
```

## 📚 Docs Links

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**More help?** Check `GETTING_STARTED.md` or `DEVELOPMENT_GUIDE.md`
