'use client';

import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

function Skeleton({ className, variant = 'text' }: Readonly<SkeletonProps>) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <output
      className={cn('bg-muted block animate-pulse', variants[variant], className)}
      aria-label="Loading..."
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
