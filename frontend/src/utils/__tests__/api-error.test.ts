import { describe, it, expect } from 'vitest';
import { ApiError, parseErrorMessage } from '../api-error';

describe('ApiError', () => {
  it('creates an instance with message and status code', () => {
    const error = new ApiError('Not found', 404, 'NOT_FOUND');
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.name).toBe('ApiError');
  });

  it('extends Error', () => {
    const error = new ApiError('test');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });

  describe('getUserMessage', () => {
    it('returns user-friendly message for 401', () => {
      const error = new ApiError('Unauthorized', 401);
      expect(error.getUserMessage()).toBe('You are not authorized. Please log in.');
    });

    it('returns user-friendly message for 404', () => {
      const error = new ApiError('Not found', 404);
      expect(error.getUserMessage()).toBe('The requested resource was not found.');
    });

    it('returns user-friendly message for 429', () => {
      const error = new ApiError('Rate limit', 429);
      expect(error.getUserMessage()).toBe('Too many requests. Please try again later.');
    });

    it('returns user-friendly message for 500', () => {
      const error = new ApiError('Internal', 500);
      expect(error.getUserMessage()).toBe('Server error. Please try again later.');
    });

    it('returns original message when no status mapping', () => {
      const error = new ApiError('Custom error');
      expect(error.getUserMessage()).toBe('Custom error');
    });
  });

  describe('error type checks', () => {
    it('identifies network errors', () => {
      const error = new ApiError('No response', undefined, 'NETWORK_ERROR');
      expect(error.isNetworkError()).toBe(true);
    });

    it('identifies non-network errors', () => {
      const error = new ApiError('Bad request', 400);
      expect(error.isNetworkError()).toBe(false);
    });

    it('identifies validation errors', () => {
      expect(new ApiError('Invalid', 400).isValidationError()).toBe(true);
      expect(new ApiError('Unprocessable', 422).isValidationError()).toBe(true);
    });

    it('identifies auth errors', () => {
      expect(new ApiError('Unauthorized', 401).isAuthError()).toBe(true);
      expect(new ApiError('Forbidden', 403).isAuthError()).toBe(true);
    });

    it('identifies non-auth errors', () => {
      expect(new ApiError('Not found', 404).isAuthError()).toBe(false);
    });
  });
});

describe('parseErrorMessage', () => {
  it('extracts message from ApiError', () => {
    const error = new ApiError('Bad request', 400);
    expect(parseErrorMessage(error)).toBe('Invalid request. Please check your input.');
  });

  it('extracts message from standard Error', () => {
    expect(parseErrorMessage(new Error('Something broke'))).toBe('Something broke');
  });

  it('returns string errors as-is', () => {
    expect(parseErrorMessage('raw error')).toBe('raw error');
  });

  it('returns fallback for unknown error types', () => {
    expect(parseErrorMessage(42)).toBe('An unexpected error occurred');
    expect(parseErrorMessage(null)).toBe('An unexpected error occurred');
  });
});
