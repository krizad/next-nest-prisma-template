# Toast & Modal Components

คู่มือการใช้งาน Toast notifications และ Modal dialogs ในโปรเจค Next.js Template

## 📦 Components ที่เพิ่มเข้ามา

- **Toast** - Notification component
- **ToastProvider** - Context provider สำหรับจัดการ toasts
- **Modal** - Dialog/popup component
- **useToast** - Hook สำหรับแสดง toast notifications
- **useModal** - Hook สำหรับจัดการ modal state

## 🚀 การติดตั้ง

Components เหล่านี้ใช้ `lucide-react` สำหรับ icons:

```bash
npm install lucide-react
```

## 📝 การใช้งาน Toast

### 1. Setup (ได้ทำไว้แล้วใน layout.tsx)

ToastProvider ถูกเพิ่มใน root layout แล้ว:

```tsx
import { ToastProvider } from '@/components/ui/toast-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### 2. ใช้งาน Toast ในหน้าใดก็ได้

```tsx
'use client';

import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const { addToast } = useToast();

  const showSuccessToast = () => {
    addToast({
      title: 'Success!',
      description: 'Your changes have been saved.',
      variant: 'success',
      duration: 5000, // milliseconds
    });
  };

  return <Button onClick={showSuccessToast}>Save Changes</Button>;
}
```

### Toast Variants

Toast มี 5 variants:

```tsx
// Default
addToast({
  title: 'Notification',
  description: 'This is a notification message',
  variant: 'default',
});

// Success (green)
addToast({
  title: 'Success!',
  description: 'Operation completed successfully',
  variant: 'success',
});

// Error (red)
addToast({
  title: 'Error!',
  description: 'Something went wrong',
  variant: 'error',
});

// Warning (yellow)
addToast({
  title: 'Warning',
  description: 'Please review your input',
  variant: 'warning',
});

// Info (blue)
addToast({
  title: 'Info',
  description: 'Here is some information',
  variant: 'info',
});
```

### Toast Options

```tsx
addToast({
  title: 'Title', // หัวข้อ (optional)
  description: 'Message', // ข้อความ (optional)
  variant: 'success', // สี/รูปแบบ
  duration: 5000, // ระยะเวลาแสดง (ms), ใส่ 0 เพื่อไม่ปิดอัตโนมัติ
});
```

## 📝 การใช้งาน Modal

### วิธีที่ 1: ใช้ useModal Hook (แนะนำ)

```tsx
'use client';

import { useModal } from '@/hooks/use-modal';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const modal = useModal();

  return (
    <>
      <Button onClick={modal.open}>Open Modal</Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="My Modal"
        description="This is a modal dialog"
      >
        <p>Modal content goes here...</p>
      </Modal>
    </>
  );
}
```

### วิธีที่ 2: ใช้ useState โดยตรง

```tsx
'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
        <p>Modal content...</p>
      </Modal>
    </>
  );
}
```

### Modal Props

```tsx
<Modal
  isOpen={boolean}              // สถานะเปิด/ปิด (required)
  onClose={() => void}          // Function เมื่อปิด modal (required)
  title="Modal Title"           // หัวข้อ (optional)
  description="Description"     // คำอธิบาย (optional)
  size="md"                     // ขนาด: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton={true}        // แสดงปุ่มปิด (default: true)
  closeOnOverlayClick={true}    // ปิดเมื่อคลิกนอก modal (default: true)
  closeOnEscape={true}          // ปิดเมื่อกด ESC (default: true)
  footer={<>Button components</>} // Footer content (optional)
>
  {children}
</Modal>
```

### Modal Sizes

```tsx
// Small
<Modal size="sm" {...props}>Content</Modal>

// Medium (default)
<Modal size="md" {...props}>Content</Modal>

// Large
<Modal size="lg" {...props}>Content</Modal>

// Extra Large
<Modal size="xl" {...props}>Content</Modal>

// Full width
<Modal size="full" {...props}>Content</Modal>
```

### Modal with Footer

```tsx
<Modal
  isOpen={modal.isOpen}
  onClose={modal.close}
  title="Confirm Action"
  footer={
    <>
      <Button variant="outline" onClick={modal.close}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

## 🎨 ตัวอย่างการใช้งานร่วมกัน

```tsx
'use client';

import { useModal } from '@/hooks/use-modal';
import { useToast } from '@/components/ui/toast-provider';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export default function DeleteButton({ itemId }) {
  const modal = useModal();
  const { addToast } = useToast();

  const handleDelete = async () => {
    try {
      // Delete item...
      modal.close();

      addToast({
        title: 'Deleted!',
        description: 'Item has been deleted successfully.',
        variant: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to delete item.',
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={modal.open}>
        Delete
      </Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Confirm Delete"
        description="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={modal.close}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  );
}
```

## 🧪 Demo Page

ดูตัวอย่างการใช้งานได้ที่:

```text
http://localhost:3000/components-demo
```

หรือดูโค้ดใน: `src/app/components-demo/page.tsx`

## 📁 ไฟล์ที่เกี่ยวข้อง

```text
src/
├── components/ui/
│   ├── toast.tsx              # Toast component
│   ├── toast-provider.tsx     # Toast context & provider
│   ├── modal.tsx              # Modal component
│   └── index.ts               # Export all components
├── hooks/
│   ├── use-modal.ts           # Modal state management hook
│   └── index.ts               # Export all hooks
└── app/
    ├── layout.tsx             # ToastProvider added here
    └── components-demo/
        └── page.tsx           # Demo page
```

## 🎨 Customization

### Custom Toast Duration

```tsx
// Auto-close after 3 seconds
addToast({ title: 'Quick message', duration: 3000 });

// Never auto-close (user must click X)
addToast({ title: 'Important', duration: 0 });
```

### Custom Modal Behavior

```tsx
// Modal ที่ไม่ให้ปิดโดยคลิกนอก modal
<Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} closeOnEscape={false}>
  <p>You must click a button to close this</p>
</Modal>
```

## 🌈 Dark Mode Support

Components เหล่านี้รองรับ dark mode อัตโนมัติผ่าน Tailwind CSS และ `next-themes`

## 📱 Responsive

- Toast จะแสดงที่มุมล่างขวาของหน้าจอ
- Modal มี responsive sizing ที่ปรับตามขนาดหน้าจอ
- Mobile-friendly และใช้งานได้บน touch devices

## ♿ Accessibility

- ใช้ ARIA attributes ที่เหมาะสม
- รองรับ keyboard navigation (ESC key)
- Focus management ใน modal
- Screen reader friendly

---

สร้างโดย: GitHub Copilot
วันที่: 14 กุมภาพันธ์ 2026
