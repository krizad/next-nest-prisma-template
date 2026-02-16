'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto } from '@fullstack/shared-types';

interface UserStore {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  isAuthenticated: boolean;
  login: (user: UserDto) => void;
  logout: () => void;
}

/**
 * Global user state management with Zustand
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
