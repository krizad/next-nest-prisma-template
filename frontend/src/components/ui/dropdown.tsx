'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
  type ButtonHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';

// --- Context ---
interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown compound components must be used within <Dropdown>');
  }
  return context;
}

// --- Dropdown Root ---
interface DropdownProps {
  children: ReactNode;
  className?: string;
}

function Dropdown({ children, className }: Readonly<DropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const contextValue = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);

  return (
    <DropdownContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// --- DropdownTrigger ---
interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DropdownTrigger({ className, children, ...props }: Readonly<DropdownTriggerProps>) {
  const { toggle } = useDropdownContext();

  return (
    <button type="button" onClick={toggle} className={className} aria-haspopup="true" {...props}>
      {children}
    </button>
  );
}

// --- DropdownContent ---
interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

function DropdownContent({ children, className, align = 'start' }: Readonly<DropdownContentProps>) {
  const { isOpen } = useDropdownContext();

  if (!isOpen) return null;

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div
      role="menu"
      className={cn(
        'bg-background border-border absolute z-50 mt-1 min-w-32 overflow-hidden rounded-md border p-1 shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        alignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- DropdownItem ---
interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

function DropdownItem({
  className,
  children,
  destructive,
  onClick,
  ...props
}: Readonly<DropdownItemProps>) {
  const { close } = useDropdownContext();

  return (
    <button
      role="menuitem"
      type="button"
      onClick={(e) => {
        onClick?.(e);
        close();
      }}
      className={cn(
        'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors',
        'focus:bg-muted focus:outline-none',
        'hover:bg-muted',
        destructive && 'text-red-500 hover:text-red-600',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// --- DropdownSeparator ---
function DropdownSeparator({ className }: Readonly<{ className?: string }>) {
  return <hr className={cn('bg-border -mx-1 my-1 h-px border-0', className)} />;
}

// --- DropdownLabel ---
function DropdownLabel({
  className,
  children,
}: Readonly<{ className?: string; children: ReactNode }>) {
  return (
    <div className={cn('text-muted-foreground px-2 py-1.5 text-xs font-semibold', className)}>
      {children}
    </div>
  );
}

Dropdown.displayName = 'Dropdown';
DropdownTrigger.displayName = 'DropdownTrigger';
DropdownContent.displayName = 'DropdownContent';
DropdownItem.displayName = 'DropdownItem';
DropdownSeparator.displayName = 'DropdownSeparator';
DropdownLabel.displayName = 'DropdownLabel';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
