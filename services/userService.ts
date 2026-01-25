import { apiClient } from "./apiClient";

export interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  locale: string | null;
  timezone: string | null;
}

export interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  last_login_at: string | null;
  last_active_at: string | null;
  sepay_code: string | null;
  fcm_token: string | null;
  profile: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalVocabularies: number;
  learnedVocabularies: number;
  currentStreak: number;
  totalStudyDays: number;
  enrolledSyllabuses: number;
}

export interface UserUpdateRequest {
  display_name?: string;
  avatar_url?: string;
  locale?: string;
  timezone?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  result: User;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  result: {
    content: User[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  result: UserStats;
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserResponse> {
    return apiClient.get<UserResponse>("/users/me");
  }

  /**
   * Get all users (admin only)
   */
  async list(params?: {
    page?: number;
    size?: number;
    role?: string;
    status?: string;
  }): Promise<UserListResponse> {
    return apiClient.get<UserListResponse>("/users", params);
  }

  /**
   * Get user by ID (admin only)
   */
  async getById(id: string): Promise<UserResponse> {
    return apiClient.get<UserResponse>(`/users/${id}`);
  }

  /**
   * Update current user profile
   */
  async updateProfile(request: UserUpdateRequest): Promise<UserResponse> {
    return apiClient.put<UserResponse>("/users/me", request);
  }

  /**
   * Update user by ID (admin only)
   */
  async updateUser(
    id: string,
    request: UserUpdateRequest,
  ): Promise<UserResponse> {
    return apiClient.put<UserResponse>(`/users/${id}`, request);
  }

  /**
   * Delete user (admin only)
   */
  async delete(id: string): Promise<UserResponse> {
    return apiClient.delete(`/users/${id}`);
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStatsResponse> {
    return apiClient.get<UserStatsResponse>("/users/me/stats");
  }
}

export const userService = new UserService();
