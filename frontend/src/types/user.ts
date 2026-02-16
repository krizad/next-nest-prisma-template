/**
 * User type definitions
 * Re-exported from @fullstack/shared-types for consistency
 */

export type { UserDto as User, CreateUserDto, UpdateUserDto } from '@fullstack/shared-types';
export { UserRole } from '@fullstack/shared-types';

/**
 * Convenience type alias
 */
export type { UserDto } from '@fullstack/shared-types';

/**
 * Display helpers for User
 */
import type { UserDto } from '@fullstack/shared-types';

export function getFullName(user: UserDto): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : user.email;
}

export function getUserInitials(user: UserDto): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  return user.email[0].toUpperCase();
}
