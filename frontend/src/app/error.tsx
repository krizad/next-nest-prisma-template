'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => (globalThis.location.href = '/')}>
            Go Home
          </Button>
        </div>
        {error.digest && (
          <p className="text-muted-foreground mt-4 text-xs">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
