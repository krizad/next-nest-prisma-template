import { z } from 'zod';
import { UserDtoSchema } from './user.dto.js';

/**
 * Login DTO Schema (Zod)
 */
export const LoginDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Login DTO Type
 */
export type LoginDto = z.infer<typeof LoginDtoSchema>;

/**
 * Login Response DTO Schema (Zod)
 */
export const LoginResponseDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserDtoSchema,
});

/**
 * Login Response DTO Type
 */
export type LoginResponseDto = z.infer<typeof LoginResponseDtoSchema>;

/**
 * Refresh Token DTO Schema (Zod)
 */
export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Refresh Token DTO Type
 */
export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;

/**
 * Refresh Token Response DTO Schema (Zod)
 */
export const RefreshTokenResponseDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

/**
 * Refresh Token Response DTO Type
 */
export type RefreshTokenResponseDto = z.infer<typeof RefreshTokenResponseDtoSchema>;
