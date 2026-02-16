import { apiClient } from '@/lib/api-client';
import { type ApiResponse, type PaginatedResponse } from '@/types/api';
import type { UserDto, CreateUserDto, UpdateUserDto } from '@fullstack/shared-types';

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * User service - user listing, fetching, management
 * Example: CRUD operations with pagination
 */
export const userService = {
  async getUsers(query?: GetUsersQuery): Promise<PaginatedResponse<UserDto>> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.search) params.append('search', query.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    return apiClient.get<UserDto[]>(endpoint) as Promise<PaginatedResponse<UserDto>>;
  },

  async getUserById(id: string): Promise<ApiResponse<UserDto>> {
    return apiClient.get<UserDto>(`/users/${id}`);
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<UserDto>> {
    return apiClient.patch<UserDto>(`/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  },

  async createUser(data: CreateUserDto): Promise<ApiResponse<UserDto>> {
    return apiClient.post<UserDto>('/users', data);
  },
};
