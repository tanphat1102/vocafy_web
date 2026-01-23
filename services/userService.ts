import { apiClient } from "./apiClient";

export interface User {
  id: number;
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  role: "USER" | "ADMIN" | "MANAGER";
  isPremium: boolean;
  premiumExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalVocabularies: number;
  learnedVocabularies: number;
  currentStreak: number;
  totalStudyDays: number;
  enrolledSyllabuses: number;
}

export interface UserUpdateRequest {
  displayName?: string;
  photoUrl?: string;
}

export interface UserResponse {
  data: User;
  message: string;
  status: number;
}

export interface UserStatsResponse {
  data: UserStats;
  message: string;
  status: number;
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserResponse> {
    return apiClient.get<UserResponse>("/users/me");
  }

  /**
   * Update current user profile
   */
  async updateProfile(request: UserUpdateRequest): Promise<UserResponse> {
    return apiClient.put<UserResponse>("/users/me", request);
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStatsResponse> {
    return apiClient.get<UserStatsResponse>("/users/me/stats");
  }

  /**
   * Check premium status
   */
  async checkPremium(): Promise<{ isPremium: boolean; expiresAt?: string }> {
    const response = await apiClient.get<UserResponse>("/users/me");
    return {
      isPremium: response.data.isPremium,
      expiresAt: response.data.premiumExpiresAt,
    };
  }
}

export const userService = new UserService();
