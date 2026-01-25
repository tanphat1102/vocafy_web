import { apiClient } from "./apiClient";

export interface Course {
  id: number;
  topic_id: number;
  title: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseCreateRequest {
  title: string;
  description?: string;
  sort_order: number;
  vocabulary_ids?: number[];
}

export interface CourseUpdateRequest {
  title: string;
  description?: string;
  sort_order: number;
  vocabulary_ids?: number[];
}

export interface CourseResponse {
  success: boolean;
  message: string;
  result: Course;
}

export interface CourseListResponse {
  success: boolean;
  message: string;
  result: {
    content: Course[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

class CourseService {
  /**
   * Get course by ID
   */
  async getById(id: number): Promise<CourseResponse> {
    return apiClient.get<CourseResponse>(`/courses/${id}`);
  }

  /**
   * List courses with pagination
   */
  async list(params?: {
    page?: number;
    size?: number;
  }): Promise<CourseListResponse> {
    return apiClient.get<CourseListResponse>("/courses", params);
  }

  /**
   * Create new course
   */
  async create(request: CourseCreateRequest): Promise<CourseResponse> {
    return apiClient.post<CourseResponse>("/courses", request);
  }

  /**
   * Update course
   */
  async update(
    id: number,
    request: CourseUpdateRequest,
  ): Promise<CourseResponse> {
    return apiClient.put<CourseResponse>(`/courses/${id}`, request);
  }

  /**
   * Delete course
   */
  async delete(id: number): Promise<CourseResponse> {
    return apiClient.delete(`/courses/${id}`);
  }
}

export const courseService = new CourseService();
