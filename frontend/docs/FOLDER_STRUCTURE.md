# 🚀 Next.js 16 - Scalable Folder Structure

โครงสร้างนี้เน้นการแยก Business Logic (Features) ออกจาก UI ส่วนกลาง ทำให้โปรเจกต์ไม่อีนุงตุงนังเวลาสเกลงานครับ

## ✅ Current Implementation

โปรเจกต์นี้ได้ implement โครงสร้างครบถ้วนแล้ว พร้อมตัวอย่างทุกส่วน:

- ✅ Feature-based architecture (user-profile)
- ✅ Shared UI components (Button, Input, Card)
- ✅ Common components (Navbar, Footer)
- ✅ Auth pages with route groups (Login, Register)
- ✅ Dashboard page
- ✅ Profile page
- ✅ Settings page
- ✅ Theme test page
- ✅ API routes (/api/users)
- ✅ Custom hooks (useLocalStorage, useMediaQuery)
- ✅ State management (Zustand)
- ✅ Utilities (cn, format functions)
- ✅ TypeScript types

## 📂 Project Structure

```text
next-template/
├── src/
│   ├── app/                # 🌐 App Router (Server Components & Routing)
│   │   ├── (auth)/         # Route Groups (Login, Register)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── api/            # API Route Handlers (Backend logic)
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           ├── profile/route.ts
│   │   │           └── stats/route.ts
│   │   ├── dashboard/      # Feature Pages
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── theme-test/
│   │   │   └── page.tsx
│   │   ├── globals.css     # Global Styles
│   │   ├── layout.tsx      # Root Layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # 🧱 Shared Components (Global)
│   │   ├── ui/             # Atomic Components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts    # Barrel export
│   │   └── common/         # Reusable Components (Navbar, Footer, Modal)
│   │       ├── navbar.tsx
│   │       ├── footer.tsx
│   │       └── index.ts
│   ├── features/           # 💡 Feature-based Modules (Business Logic)
│   │   └── user-profile/   # แยกโฟลเดอร์ตามฟีเจอร์
│   │       ├── components/ # Components เฉพาะฟีเจอร์นี้
│   │       │   ├── profile-card.tsx
│   │       │   ├── profile-stats.tsx
│   │       │   ├── profile-edit-form.tsx
│   │       │   └── index.ts
│   │       ├── hooks/      # Custom Hooks สำหรับฟีเจอร์นี้
│   │       │   └── use-user-profile.ts
│   │       ├── services/   # API fetching เฉพาะฟีเจอร์
│   │       │   └── profile-service.ts
│   │       └── types.ts    # Types เฉพาะฟีเจอร์
│   ├── hooks/              # 🎣 Global Custom Hooks
│   │   ├── use-local-storage.ts
│   │   ├── use-media-query.ts
│   │   └── index.ts
│   ├── lib/                # ⚙️ Third-party Config (Prisma, Supabase, Axios)
│   │   └── api-client.ts
│   ├── store/              # 🧠 State Management (Zustand, Redux)
│   │   └── user-store.ts
│   ├── types/              # 🏷️ Global TypeScript Interfaces
│   │   ├── api.ts
│   │   ├── user.ts
│   │   └── index.ts
│   └── utils/              # 🛠️ Helper Functions (formatDate, cn)
│       ├── cn.ts
│       ├── format.ts
│       └── index.ts
├── public/                 # 📂 Static Assets (Images, Icons)
├── .env.example            # Environment Variables (template)
├── .env.local              # Environment Variables (local override)
├── next.config.ts          # Next.js Config
├── tsconfig.json           # TypeScript Config
├── package.json
└── README.md

```

## 🎯 การใช้งาน

### Import Components

```tsx
// UI Components
import { Button, Input, Card } from '@/components/ui';

// Common Components
import { Navbar, Footer } from '@/components/common';

// Feature Components
import { ProfileCard } from '@/features/user-profile/components';
```

### Import Hooks

```tsx
// Global Hooks
import { useLocalStorage, useMediaQuery } from '@/hooks';

// Feature Hooks
import { useUserProfile } from '@/features/user-profile/hooks/use-user-profile';
```

### Import Types

```tsx
// Global Types
import { type User, type ApiResponse } from '@/types';

// Feature Types
import { type UserProfile } from '@/features/user-profile/types';
```

### Import Utilities

```tsx
import { cn, formatDate, formatCurrency } from '@/utils';
```

## 🚀 เพิ่มฟีเจอร์ใหม่

1. สร้างโฟลเดอร์ฟีเจอร์:

```bash
mkdir -p src/features/my-feature/{components,hooks,services}
```

1. สร้าง types:

```typescript
// src/features/my-feature/types.ts
export interface MyFeature {
  id: string;
  name: string;
}
```

1. สร้าง service:

```typescript
// src/features/my-feature/services/my-service.ts
import { apiClient } from '@/lib/api-client';

export const myService = {
  async getData() {
    return apiClient.get('/api/my-data');
  },
};
```

1. สร้าง components และ hooks ตามต้องการ

## 📝 Best Practices

1. **แยก Business Logic ออกจาก UI**
   - Components ควรเป็นแค่ presentational
   - Business logic ควรอยู่ใน hooks และ services

2. **ใช้ Path Alias**
   - ใช้ `@/` แทน relative paths
   - เช่น `@/components/ui/button` แทน `../../components/ui/button`

3. **Type Safety**
   - สร้าง types สำหรับทุก feature
   - ใช้ shared types จาก `@/types`

4. **Reusability**
   - Component ที่ใช้ซ้ำมากกว่า 1 ครั้ง ควรอยู่ใน `components/`
   - Component เฉพาะฟีเจอร์ ควรอยู่ใน `features/[feature]/components/`
