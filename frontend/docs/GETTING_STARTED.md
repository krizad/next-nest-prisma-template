# 🚀 Getting Started

คู่มือฉบับสั้นสำหรับเริ่มต้นใช้งาน Next.js Template นี้

## 📋 Prerequisites

- **Node.js** >= 18.0 ([Download](https://nodejs.org/))
- **npm** (มาพร้อมกับ Node.js) หรือ `pnpm` / `yarn`
- **Git** (optional แต่แนะนำ)

## 💻 Setup (เพียง 3 ขั้น)

### 1️⃣ Clone หรือ Copy โปรเจกต์

```bash
# Clone จาก GitHub (ถ้าได้)
git clone <your-repo-url>
cd next-template

# หรือ Copy files โดยตรง
```

### 2️⃣ Install Dependencies

```bash
npm install
# หรือ pnpm install ถ้าใช้ pnpm
```

### 3️⃣ Start Development Server

```bash
npm run dev
# หรือใช้ Make (ถ้าชอบการพิมพ์น้อย):
make dev
```

ที่นี่ไปที่ [`http://localhost:3000`](http://localhost:3000) ในเบราว์เซอร์

---

## 📁 ไฟล์ที่ต้องแก้ไขสำหรับโปรเจกต์ใหม่

ก่อนเริ่มพัฒนา ให้อัปเดตข้อมูลของโปรเจกต์:

### 1. `package.json`

```json
{
  "name": "my-awesome-app", // ← เปลี่ยนชื่อโปรเจกต์
  "version": "0.1.0", // ← เวอร์ชันแรก
  "description": "My amazing app" // ← คำอธิบาย
}
```

### 2. `src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: 'My Awesome App', // ← โปรแกรม title
  description: 'App description', // ← Meta description (SEO)
};
```

### 3. `.env.local` (สร้างใหม่)

Copy จาก `.env.example`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 4. Customize Theme

- Edit `src/app/globals.css` สำหรับสี Tailwind
- Edit `Navbar` ใน `src/components/common/navbar.tsx`
- Edit `Footer` ใน `src/components/common/footer.tsx`

---

## 🧪 Available Commands

### With npm

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start dev server (localhost:3000)      |
| `npm run build`     | Build สำหรับ production                |
| `npm run start`     | Run production build                   |
| `npm run lint`      | ตรวจสอบ code quality                   |
| `npm run lint:fix`  | Fix linting issues อัตโนมัติ           |
| `npm run typecheck` | ตรวจสอบ TypeScript                     |
| `npm run format`    | Format code ด้วย Prettier              |
| `npm run check`     | รันทั้งหมด (lint + typecheck + format) |

### With Make (Recommended!)

```bash
make help          # Show all available commands
make dev           # Start dev server
make build         # Build for production
make lint-fix      # Fix linting issues
make check         # Full code quality check
make clean         # Clean cache & build
make install       # Install dependencies
```

**💡 Tip:** Use `make` commands for faster typing! Example: `make dev` instead of `npm run dev`

---

## 📝 Folder Structure Guide

```
src/
├── app/              👈 หน้าและ API routes
├── components/       👈 UI components ที่ใช้ซ้ำได้
├── features/         👈 Business logic (Feature modules)
├── hooks/            👈 Custom React hooks
├── lib/              👈 API client, config
├── store/            👈 State management (Zustand)
├── types/            👈 TypeScript types
└── utils/            👈 Helper functions
```

**ดู [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)** สำหรับรายละเอียดเต็ม

---

## 🎯 ขั้นตอนถัดไป

### เพิ่มหน้า (Page) ใหม่

```bash
# สร้างไฟล์: src/app/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>;
}
```

→ เข้าถึงได้ที่ `/my-page`

### เพิ่ม API Route

```bash
# สร้างไฟล์: src/app/api/my-endpoint/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' });
}
```

→ POST/GET at `/api/my-endpoint`

### เพิ่ม Feature Module

ตามอัตชาติ `user-profile` example:

```
src/features/my-feature/
├── components/
├── hooks/
├── services/        (API calls)
├── types.ts        (TypeScript types)
└── index.ts        (exports)
```

---

## 📖 Examples ในโปรเจกต์

- **Dashboard** → `/dashboard` - Simple page example
- **Profile** → `/profile` - Feature-based architecture demo
- **Auth Pages** → `/login`, `/register` - Route groups
- **Theme Test** → `/theme-test` - Dark/Light theme demo
- **API Sandbox** → `/api-sandbox` - API integration examples

---

## ❓ FAQs

**Q: Tailwind CSS v4 ต่างกับ v3 ยังไง?**
A: v4 มี PostCSS CLI built-in, ตัวอักษรชะลูด, ประสิทธิภาพดีขึ้น [อ่านเพิ่มเติม](https://tailwindcss.com/docs/v4-migration)

**Q: ต้องใช้ Next.js API Routes หรือ Backend ก็ได้?**
A: ใช้เล่นเลยได้ API client ตั้งไป backend อื่นก็ได้ (Express, Django, etc)

**Q: ต้อง Zustand?**
A: ไม่บังคับ ปลด deps ได้ หรือเปลี่ยนเป็น Redux, Context ได้

---

## 🆘 Troubleshooting

**Port 3000 ถูกใช้งาน?**

```bash
npm run dev -- -p 3001  # เปลี่ยนเป็น port 3001
```

**Dependencies เสีย?**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Cache issue?**

```bash
rm -rf .next
npm run dev
```

---

## 📞 Support & Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

🎉 **Ready to build?** Start at `/src/app/page.tsx` หรือติดตามโครงสร้าง `user-profile` feature!
