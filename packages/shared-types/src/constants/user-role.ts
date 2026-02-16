/**
 * User Role Enum
 * Mirrors the Prisma UserRole enum
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * User Role values as an array
 */
export const USER_ROLES = Object.values(UserRole);
