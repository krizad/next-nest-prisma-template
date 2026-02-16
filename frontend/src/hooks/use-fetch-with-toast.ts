'use client';

import { useCallback } from 'react';
import { useToast } from '@/components/ui/toast-provider';
import { useFetch, useMutation, UseFetchOptions, UseMutationOptions } from './use-fetch';
import { type ApiResponse } from '@/types/api';
import { parseErrorMessage } from '@/utils/api-error';

/**
 * Options for useFetchWithToast hook
 */
export interface UseFetchWithToastOptions<T = unknown> extends UseFetchOptions<T> {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorTitle?: string;
}

/**
 * Hook for fetching data with automatic toast notifications
 * Shows error toast on failure, optional success toast
 *
 * @example
 * const { data, isLoading, refetch } = useFetchWithToast(
 *   () => apiClient.get('/users'),
 *   { showErrorToast: true }
 * );
 */
export function useFetchWithToast<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  options: UseFetchWithToastOptions<T> = {},
) {
  const { addToast } = useToast();
  const {
    showSuccessToast = false,
    successMessage,
    showErrorToast = true,
    errorTitle = 'Error',
    onSuccess,
    onError,
    ...fetchOptions
  } = options;

  // Wrap callbacks to show toasts
  const handleSuccess = useCallback(
    (data: T) => {
      if (showSuccessToast) {
        addToast({
          title: 'Success',
          description: successMessage || 'Data loaded successfully',
          variant: 'success',
        });
      }
      onSuccess?.(data);
    },
    [showSuccessToast, successMessage, addToast, onSuccess],
  );

  const handleError = useCallback(
    (error: string) => {
      if (showErrorToast) {
        addToast({
          title: errorTitle,
          description: parseErrorMessage(error),
          variant: 'error',
          duration: 7000,
        });
      }
      onError?.(error);
    },
    [showErrorToast, errorTitle, addToast, onError],
  );

  return useFetch(fetchFn, {
    ...fetchOptions,
    onSuccess: handleSuccess,
    onError: handleError,
  });
}

/**
 * Options for useMutationWithToast hook
 */
export interface UseMutationWithToastOptions<T = unknown> extends UseMutationOptions<T> {
  showSuccessToast?: boolean;
  successTitle?: string;
  successMessage?: string;
  showErrorToast?: boolean;
  errorTitle?: string;
}

/**
 * Hook for mutations with automatic toast notifications
 * Shows success/error toasts based on mutation result
 *
 * @example
 * const { mutate, isLoading } = useMutationWithToast(
 *   (data) => apiClient.post('/users', data),
 *   {
 *     showSuccessToast: true,
 *     successMessage: 'User created!',
 *     showErrorToast: true,
 *   }
 * );
 */
export function useMutationWithToast<T, P = unknown>(
  mutationFn: (params?: P) => Promise<ApiResponse<T>>,
  options: UseMutationWithToastOptions<T> = {},
) {
  const { addToast } = useToast();
  const {
    showSuccessToast = true,
    successTitle = 'Success',
    successMessage = 'Action completed successfully',
    showErrorToast = true,
    errorTitle = 'Error',
    onSuccess,
    onError,
    ...mutationOptions
  } = options;

  // Wrap callbacks to show toasts
  const handleSuccess = useCallback(
    (data: T) => {
      if (showSuccessToast) {
        addToast({
          title: successTitle,
          description: successMessage,
          variant: 'success',
        });
      }
      onSuccess?.(data);
    },
    [showSuccessToast, successTitle, successMessage, addToast, onSuccess],
  );

  const handleError = useCallback(
    (error: string) => {
      if (showErrorToast) {
        addToast({
          title: errorTitle,
          description: parseErrorMessage(error),
          variant: 'error',
          duration: 7000,
        });
      }
      onError?.(error);
    },
    [showErrorToast, errorTitle, addToast, onError],
  );

  return useMutation(mutationFn, {
    ...mutationOptions,
    onSuccess: handleSuccess,
    onError: handleError,
  });
}
