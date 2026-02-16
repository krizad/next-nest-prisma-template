import { z } from 'zod';

/**
 * Pagination Meta DTO
 */
export interface PaginationMeta {
  mode: 'page' | 'none';
  page?: number;
  size?: number;
  total?: number;
  pageCount?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  headers?: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
}

/**
 * Context Meta DTO
 */
export interface ContextMeta {
  requestId: string;
  path: string;
  method: string;
  status: number;
  timestamp: string;
}

/**
 * Error Body DTO
 */
export interface ErrorBody {
  message: string;
  code?: string;
  type?: string;
  details?: any;
  data?: any;
}

/**
 * Success Response DTO
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: PaginationMeta | null;
  context: ContextMeta;
}

/**
 * Error Response DTO
 */
export interface ErrorResponse {
  success: false;
  error: ErrorBody;
  context: ContextMeta;
}

/**
 * API Response Type (Union of Success and Error)
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Type guard for success response
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard for error response
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false;
}

/**
 * Paginated Response Type
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

/**
 * Paginated Response Schema (Zod)
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
  });
