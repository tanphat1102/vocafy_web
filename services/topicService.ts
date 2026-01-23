import { apiClient } from "./apiClient";

export interface Topic {
  id: number;
  syllabusId: number;
  name: string;
  description?: string;
  dayOfLearning: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicCreateRequest {
  syllabusId: number;
  name: string;
  description?: string;
  dayOfLearning: number;
}

export interface TopicUpdateRequest {
  name?: string;
  description?: string;
  dayOfLearning?: number;
}

export interface TopicResponse {
  data: Topic;
  message: string;
  status: number;
}

export interface TopicListResponse {
  data: {
    content: Topic[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
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
  async delete(id: number): Promise<{ message: string; status: number }> {
    return apiClient.delete(`/topics/${id}`);
  }
}

export const topicService = new TopicService();
