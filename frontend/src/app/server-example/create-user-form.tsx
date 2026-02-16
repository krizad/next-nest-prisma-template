'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createUserAction } from './actions';

interface ActionState {
  success?: boolean;
  error?: string;
  data?: { id: string; name: string; email: string };
}

async function formAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const result = await createUserAction(formData);
  return result as ActionState;
}

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(formAction, {});

  return (
    <div>
      <form action={action} className="space-y-4">
        <Input label="Name" name="name" placeholder="John Doe" required />
        <Input label="Email" name="email" type="email" placeholder="john@example.com" required />
        <Button type="submit" isLoading={isPending}>
          Create User
        </Button>
      </form>

      {/* Feedback */}
      {state.success && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          User &quot;{state.data?.name}&quot; created successfully!
        </div>
      )}
      {state.error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </div>
      )}
    </div>
  );
}
