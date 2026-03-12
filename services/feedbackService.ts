import { apiClient } from "./apiClient";

export interface Feedback {
  id: number;
  user_id: string;
  user_display_name: string | null;
  user_email: string;
  rating: number;
  title: string | null;
  content: string | null;
  admin_reply: string | null;
  replied_by_user_id: string | null;
  replied_by_email: string | null;
  replied_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FeedbackListResponse {
  success: boolean;
  message: string;
  result: {
    content: Feedback[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

export interface RatingSummary {
  total_ratings: number;
  rating_5: number;
  rating_4: number;
  rating_3: number;
  rating_2: number;
  rating_1: number;
}

export interface RatingSummaryResponse {
  success: boolean;
  message: string;
  result: RatingSummary;
}

export interface FeedbackCreateRequest {
  rating: number;
  title?: string;
  content?: string;
}

interface ReplyFeedbackRequest {
  admin_reply: string;
}

class FeedbackService {
  async listAll(params?: {
    page?: number;
    size?: number;
  }): Promise<FeedbackListResponse> {
    return apiClient.get<FeedbackListResponse>("/feedbacks", params);
  }

  async listMine(params?: {
    page?: number;
    size?: number;
  }): Promise<FeedbackListResponse> {
    return apiClient.get<FeedbackListResponse>("/feedbacks/me", params);
  }

  async create(request: FeedbackCreateRequest): Promise<{
    success: boolean;
    message: string;
    result: Feedback;
  }> {
    return apiClient.post<{
      success: boolean;
      message: string;
      result: Feedback;
    }>("/feedbacks", request);
  }

  async listAdmin(params?: {
    page?: number;
    size?: number;
  }): Promise<FeedbackListResponse> {
    return apiClient.get<FeedbackListResponse>("/feedbacks/admin", params);
  }

  async replyFeedback(id: number, adminReply: string): Promise<void> {
    await apiClient.put(`/feedbacks/${id}/reply`, {
      admin_reply: adminReply,
    } as ReplyFeedbackRequest);
  }

  async getAdminRatingSummary(): Promise<RatingSummaryResponse> {
    return apiClient.get<RatingSummaryResponse>("/feedbacks/admin/rating-summary");
  }
}

export const feedbackService = new FeedbackService();
