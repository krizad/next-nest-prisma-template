'use client';

import { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
}: Readonly<ToastProps>) {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700',
    success: 'bg-green-50 dark:bg-green-900 border-green-400 dark:border-green-700',
    error: 'bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-700',
    warning: 'bg-amber-50 dark:bg-amber-900 border-amber-400 dark:border-amber-700',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-700',
  };

  const iconStyles = {
    default: 'text-gray-700 dark:text-gray-300',
    success: 'text-green-700 dark:text-green-300',
    error: 'text-red-700 dark:text-red-300',
    warning: 'text-amber-700 dark:text-amber-300',
    info: 'text-blue-700 dark:text-blue-300',
  };

  const textStyles = {
    default: 'text-gray-900 dark:text-gray-100',
    success: 'text-green-900 dark:text-green-100',
    error: 'text-red-900 dark:text-red-100',
    warning: 'text-amber-900 dark:text-amber-100',
    info: 'text-blue-900 dark:text-blue-100',
  };

  const descriptionStyles = {
    default: 'text-gray-600 dark:text-gray-300',
    success: 'text-green-700 dark:text-green-200',
    error: 'text-red-700 dark:text-red-200',
    warning: 'text-amber-700 dark:text-amber-200',
    info: 'text-blue-700 dark:text-blue-200',
  };

  const icons = {
    default: Info,
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <div
      id={id}
      className={cn(
        'pointer-events-auto flex w-full max-w-md gap-3 rounded-lg border-2 p-4 shadow-2xl transition-all',
        'animate-in slide-in-from-right-full duration-300',
        variantStyles[variant],
      )}
      role="alert"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconStyles[variant])} />
      <div className="flex-1 space-y-1">
        {title && (
          <div className={cn('text-sm leading-none font-bold', textStyles[variant])}>{title}</div>
        )}
        {description && (
          <div className={cn('text-sm leading-relaxed', descriptionStyles[variant])}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className={cn(
          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all',
          'hover:bg-black/10 dark:hover:bg-white/20',
          'focus:ring-2 focus:ring-gray-400 focus:outline-none dark:focus:ring-white/50',
          iconStyles[variant],
        )}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}
