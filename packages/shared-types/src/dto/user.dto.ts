import { z } from 'zod';
import { UserRole } from '../constants/user-role.js';

/**
 * User DTO Schema (Zod)
 */
export const UserDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * User DTO Type
 */
export type UserDto = z.infer<typeof UserDtoSchema>;

/**
 * Create User DTO Schema (for registration/creation)
 */
export const CreateUserDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(100).optional().nullable(),
  lastName: z.string().min(1).max(100).optional().nullable(),
  role: z.nativeEnum(UserRole).default(UserRole.USER).optional(),
});

/**
 * Create User DTO Type
 */
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

/**
 * Update User DTO Schema
 */
export const UpdateUserDtoSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1).max(100).optional().nullable(),
  lastName: z.string().min(1).max(100).optional().nullable(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Update User DTO Type
 */
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
