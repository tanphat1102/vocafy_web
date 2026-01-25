import { apiClient } from "./apiClient";
import type { Course } from "./courseService";

export interface Topic {
  id: number;
  syllabus_id: number;
  title: string;
  description?: string;
  total_days: number;
  sort_order: number;
  is_active: boolean;
  is_deleted: boolean;
  courses: Course[];
  created_at: string;
  updated_at: string;
}

export interface TopicCreateRequest {
  title: string;
  description?: string;
  total_days: number;
  sort_order?: number;
  course_ids?: number[];
}

export interface TopicUpdateRequest {
  title: string;
  description?: string;
  total_days: number;
  sort_order?: number;
  course_ids?: number[];
}

export interface TopicResponse {
  success: boolean;
  message: string;
  result: Topic;
}

export interface TopicListResponse {
  success: boolean;
  message: string;
  result: {
    content: Topic[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

class TopicService {
  /**
   * Get topic by ID
   */
  async getById(id: number): Promise<TopicResponse> {
    return apiClient.get<TopicResponse>(`/topics/${id}`);
  }

  /**
   * List topics with pagination
   */
  async list(params?: {
    page?: number;
    size?: number;
  }): Promise<TopicListResponse> {
    return apiClient.get<TopicListResponse>("/topics", params);
  }

  /**
   * Create new topic
   */
  async create(request: TopicCreateRequest): Promise<TopicResponse> {
    return apiClient.post<TopicResponse>("/topics", request);
  }

  /**
   * Update topic
   */
  async update(
    id: number,
    request: TopicUpdateRequest,
  ): Promise<TopicResponse> {
    return apiClient.put<TopicResponse>(`/topics/${id}`, request);
  }

  /**
   * Delete topic
   */
  async delete(id: number): Promise<TopicResponse> {
    return apiClient.delete(`/topics/${id}`);
  }
}

export const topicService = new TopicService();
