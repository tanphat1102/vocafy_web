import { apiClient } from "./apiClient";
import type { Topic } from "./topicService";

export interface Syllabus {
  id: number;
  title: string;
  description: string;
  image_background?: string | null;
  image_icon?: string | null;
  total_days: number;
  language_set: string;
  study_language?: string | null;
  target_languages?: string[] | null;
  visibility: "PUBLIC" | "PRIVATE";
  source_type: string;
  created_by_user_id: string;
  active: boolean | null;
  is_deleted: boolean | null;
  created_at: string;
  updated_at: string | null;
  topics: Topic[] | null;
}

export interface SyllabusCreateRequest {
  title: string;
  description?: string;
  total_days: number;
  language_set: string;
  visibility: "PUBLIC" | "PRIVATE";
  source_type?: string;
}

export interface SyllabusUpdateRequest {
  title?: string;
  description?: string;
  total_days?: number;
  language_set?: string;
  visibility?: "PUBLIC" | "PRIVATE";
  source_type?: string;
}

export interface SyllabusResponse {
  success: boolean;
  message: string;
  result: Syllabus;
}

export interface SyllabusListResponse {
  success: boolean;
  message: string;
  result: {
    content: Syllabus[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

class SyllabusService {
  /**
   * Get syllabus by ID
   */
  async getById(id: number): Promise<SyllabusResponse> {
    return apiClient.get<SyllabusResponse>(`/syllabus/${id}`);
  }

  /**
   * List syllabuses with pagination
   */
  async list(params?: {
    page?: number;
    size?: number;
  }): Promise<SyllabusListResponse> {
    return apiClient.get<SyllabusListResponse>("/syllabus", params);
  }

  /**
   * Create new syllabus
   */
  async create(request: SyllabusCreateRequest): Promise<SyllabusResponse> {
    return apiClient.post<SyllabusResponse>("/syllabus", request);
  }

  /**
   * Update syllabus
   */
  async update(
    id: number,
    request: SyllabusUpdateRequest,
  ): Promise<SyllabusResponse> {
    return apiClient.put<SyllabusResponse>(`/syllabus/${id}`, request);
  }

  /**
   * Delete syllabus
   */
  async delete(id: number): Promise<SyllabusResponse> {
    return apiClient.delete(`/syllabus/${id}`);
  }
}

export const syllabusService = new SyllabusService();
