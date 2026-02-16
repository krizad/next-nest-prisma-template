'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast-provider';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ComponentsPage() {
  const { addToast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [toastDuration, setToastDuration] = useState(5000);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Toast handlers
  const showToast = (variant: 'default' | 'success' | 'error' | 'warning' | 'info') => {
    const toastConfig = {
      default: { title: 'Notification', description: 'Default toast message' },
      success: { title: '✅ Success!', description: 'Action completed successfully' },
      error: { title: '❌ Error!', description: 'Something went wrong' },
      warning: { title: '⚠️ Warning!', description: 'Please check your input' },
      info: { title: 'ℹ️ Info', description: 'Informational message' },
    };

    addToast({
      ...toastConfig[variant],
      variant,
      duration: toastDuration,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      showToast('success');
      setFormData({ name: '', email: '' });
      setIsFormModalOpen(false);
    } else {
      showToast('error');
    }
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">UI Components</h1>
        <p className="text-muted-foreground text-lg">
          Showcase of all available UI components and their variants
        </p>
      </div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Component Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input Fields</CardTitle>
          <CardDescription>Text input with different states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="input1" className="mb-2 block text-sm font-medium">
                Default Input
              </label>
              <Input id="input1" placeholder="Enter text here..." />
            </div>
            <div>
              <label htmlFor="input2" className="mb-2 block text-sm font-medium">
                With Value
              </label>
              <Input id="input2" placeholder="Enter text here..." defaultValue="Sample text" />
            </div>
            <div>
              <label htmlFor="input3" className="mb-2 block text-sm font-medium">
                Disabled
              </label>
              <Input id="input3" placeholder="Disabled input" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Five different toast variants with customizable duration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (ms)
            </label>
            <div className="flex gap-2">
              <Input
                id="duration"
                type="number"
                value={toastDuration}
                onChange={(e) => setToastDuration(parseInt(e.target.value))}
                className="max-w-xs"
              />
              <span className="text-muted-foreground pt-2 text-sm">
                {toastDuration === 0 ? 'Infinite' : `${(toastDuration / 1000).toFixed(1)}s`}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Toast Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => showToast('default')} variant="outline">
                Default
              </Button>
              <Button onClick={() => showToast('success')} variant="primary">
                Success
              </Button>
              <Button onClick={() => showToast('error')} variant="destructive">
                Error
              </Button>
              <Button onClick={() => showToast('warning')} variant="secondary">
                Warning
              </Button>
              <Button onClick={() => showToast('info')} variant="ghost">
                Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialogs */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Dialogs</CardTitle>
          <CardDescription>Modal windows with different content types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Modal Examples</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsModalOpen(true)} variant="primary">
                Open Modal
              </Button>
              <Button onClick={() => setIsFormModalOpen(true)} variant="primary">
                Form Modal
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="mb-2 text-sm font-medium">Modal Features:</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>✓ Multiple sizes: sm, md, lg</li>
              <li>✓ Customizable title and description</li>
              <li>✓ Close on escape or overlay click</li>
              <li>✓ Smooth animations and backdrop blur</li>
              <li>✓ Focus management and accessibility</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Card Component Section */}
      <Card>
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
          <CardDescription>This is an example card showing all sections</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Cards are versatile containers used to group related information. They support headers,
            descriptions, and custom content.
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="mb-2 text-sm font-medium">Card Structure:</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• CardHeader: Title and description</li>
              <li>• CardContent: Main content area</li>
              <li>• CardFooter: Optional footer section</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Basic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal"
        description="This is a modal dialog example"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                showToast('success');
                setIsModalOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <p className="text-muted-foreground">
          This modal demonstrates the basic structure with title, description, content, and footer
          with action buttons. Click outside or press ESC to close.
        </p>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Contact Form"
        description="Please fill in your information"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="contact-form">
              Submit
            </Button>
          </div>
        }
      >
        <form id="contact-form" onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name *
            </label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
