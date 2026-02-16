'use client';

import { useCallback, useEffect, useState } from 'react';
import { type ApiResponse } from '@/types/api';

export interface UseFetchOptions<T = unknown> {
  skip?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export interface UseFetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Reusable hook for fetching data
 * Handles loading/error states automatically
 * Example: const { data, isLoading } = useFetch(() => apiClient.get('/endpoint'))
 */
export function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  options: UseFetchOptions<T> = {},
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const { skip, onSuccess, onError } = options;

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await fetchFn();
      if (result.success) {
        setState({ data: result.data ?? null, error: null, isLoading: false });
        if (result.data !== undefined) {
          onSuccess?.(result.data);
        }
      } else {
        const errorMessage = result.error.message || 'Unknown error';
        setState({ data: null, error: errorMessage, isLoading: false });
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Fetch failed';
      setState({ data: null, error: errorMsg, isLoading: false });
      onError?.(errorMsg);
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    const shouldFetch = !skip;
    if (!shouldFetch) {
      return;
    }

    // Perform initial fetch
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]); // Only depend on skip, not refetch to avoid infinite loops

  return { ...state, refetch };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 * Handles loading/error states for data mutations
 */
export interface UseMutationOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export interface UseMutationState<T, P = unknown> extends UseFetchState<T> {
  mutate: (params?: P) => Promise<void>;
}

export function useMutation<T, P = unknown>(
  mutationFn: (params?: P) => Promise<ApiResponse<T>>,
  options: UseMutationOptions<T> = {},
): UseMutationState<T, P> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const { onSuccess, onError } = options;

  const mutate = useCallback(
    async (params?: P) => {
      setState({ data: null, error: null, isLoading: true });
      try {
        const result = await mutationFn(params);
        if (result.success) {
          setState({ data: result.data ?? null, error: null, isLoading: false });
          if (result.data !== undefined) {
            onSuccess?.(result.data);
          }
        } else {
          const errorMessage = result.error.message || 'Unknown error';
          setState({ data: null, error: errorMessage, isLoading: false });
          onError?.(errorMessage);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Mutation failed';
        setState({ data: null, error: errorMsg, isLoading: false });
        onError?.(errorMsg);
      }
    },
    [mutationFn, onSuccess, onError],
  );

  return { ...state, mutate };
}
