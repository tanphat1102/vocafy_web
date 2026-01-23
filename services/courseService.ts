import { apiClient } from "./apiClient";

export interface Course {
  id: number;
  topicId: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateRequest {
  topicId: number;
  name: string;
  description?: string;
}

export interface CourseUpdateRequest {
  name?: string;
  description?: string;
}

export interface CourseResponse {
  data: Course;
  message: string;
  status: number;
}

export interface CourseListResponse {
  data: {
    content: Course[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
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
  async delete(id: number): Promise<{ message: string; status: number }> {
    return apiClient.delete(`/courses/${id}`);
  }
}

export const courseService = new CourseService();
