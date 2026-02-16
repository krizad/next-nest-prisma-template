import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
} from '@fullstack/shared-types';

/**
 * API client using axios with error handling & interceptors
 * Handles backend API response format: {success, data, meta?, context}
 */
class ApiClient {
  private readonly instance: AxiosInstance;

  private readonly defaultTimeout: number;

  constructor(baseUrl: string = '/api', timeout: number = 30000) {
    this.defaultTimeout = timeout;

    this.instance = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor to handle backend response format
    this.instance.interceptors.response.use(
      (response) => {
        // Backend always returns {success, data, context} format
        // Pass through the response as-is if it matches the format
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          return response;
        }
        // If not in expected format, wrap it
        return {
          ...response,
          data: {
            success: true,
            data: response.data,
            context: {
              requestId: 'unknown',
              path: response.config.url || '',
              method: response.config.method?.toUpperCase() || 'GET',
              status: response.status,
              timestamp: new Date().toISOString(),
            },
          },
        };
      },
      (error: AxiosError<ErrorResponse>) => {
        // Handle error responses from backend
        if (error.response?.data && 'success' in error.response.data) {
          // Backend error response is already in correct format
          return Promise.reject(error);
        }

        // Transform unknown errors to backend format
        const errorResponse: ErrorResponse = {
          success: false,
          error: {
            message: error.message || 'An error occurred',
            code: error.code,
            type: error.name,
          },
          context: {
            requestId: 'unknown',
            path: error.config?.url || '',
            method: error.config?.method?.toUpperCase() || 'GET',
            status: error.response?.status || 500,
            timestamp: new Date().toISOString(),
          },
        };

        error.response = {
          ...error.response!,
          data: errorResponse,
        } as any;

        return Promise.reject(error);
      },
    );
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      // For GET and DELETE, axios signature is (url, config) — no data param
      const response =
        method === 'get' || method === 'delete'
          ? await this.instance[method]<SuccessResponse<T>>(endpoint, config)
          : await this.instance[method]<SuccessResponse<T>>(endpoint, data, config);

      // Return the backend response as-is (already in ApiResponse format)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // If we have a proper backend error response, return it
      if (axiosError.response?.data?.success === false) {
        return axiosError.response.data;
      }

      // Fallback error response
      return {
        success: false,
        error: {
          message: axiosError.message || 'An error occurred',
          code: axiosError.code,
        },
        context: {
          requestId: 'unknown',
          path: endpoint,
          method: method.toUpperCase(),
          status: axiosError.response?.status || 500,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('get', endpoint, undefined, config);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('post', endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('put', endpoint, data, config);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('patch', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('delete', endpoint, undefined, config);
  }

  /**
   * Set default headers (useful for auth tokens)
   */
  setHeader(key: string, value: string): void {
    this.instance.defaults.headers.common[key] = value;
  }

  /**
   * Remove a header
   */
  removeHeader(key: string): void {
    delete this.instance.defaults.headers.common[key];
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();
