import { AxiosError } from 'axios';

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Create ApiError from Axios error
   */
  static fromAxiosError(error: AxiosError<unknown>): ApiError {
    let message = 'An error occurred';
    let statusCode: number | undefined;
    let code: string | undefined;
    let details: unknown;

    if (error.response) {
      // Server responded with error status
      statusCode = error.response.status;
      const data = error.response.data;

      if (data && typeof data === 'object') {
        const errorData = data as Record<string, unknown>;
        message = (errorData.message as string) || (errorData.error as string) || error.message;
        code = errorData.code as string;
        details = errorData.details;
      }
    } else if (error.request) {
      // Request was made but no response
      message = 'No response from server';
      code = 'NETWORK_ERROR';
    } else {
      // Error in request configuration
      message = error.message;
      code = error.code;
    }

    return new ApiError(message, statusCode, code, details);
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    // Map status codes to user-friendly messages
    if (this.statusCode) {
      switch (this.statusCode) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized. Please log in.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 408:
          return 'Request timeout. Please try again.';
        case 409:
          return 'This action conflicts with existing data.';
        case 422:
          return 'Validation error. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 502:
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        case 504:
          return 'Gateway timeout. Please try again.';
        default:
          break;
      }
    }

    // Use the original message if no mapping found
    return this.message;
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR' || this.code === 'ECONNABORTED';
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 422 || this.statusCode === 400;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }
}

/**
 * Parse error to string message
 */
export function parseErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.getUserMessage();
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}
