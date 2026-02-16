/**
 * Global API type definitions
 * These types are aligned with the backend API response format
 */

// Re-export shared types for convenience
export type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  PaginationMeta,
  ContextMeta,
  ErrorBody,
  PaginatedResponse,
} from '@fullstack/shared-types';

export { isSuccessResponse, isErrorResponse } from '@fullstack/shared-types';

/**
 * Legacy API Error type (for compatibility)
 * @deprecated Use ErrorResponse from shared-types instead
 */
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
