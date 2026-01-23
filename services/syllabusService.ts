import { apiClient } from "./apiClient";

export interface Syllabus {
  id: number;
  name: string;
  description?: string;
  language: string;
  level?: string;
  visibility: "PUBLIC" | "PRIVATE";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusCreateRequest {
  name: string;
  description?: string;
  language: string;
  level?: string;
  visibility: "PUBLIC" | "PRIVATE";
}

export interface SyllabusUpdateRequest {
  name?: string;
  description?: string;
  language?: string;
  level?: string;
  visibility?: "PUBLIC" | "PRIVATE";
}

export interface SyllabusResponse {
  data: Syllabus;
  message: string;
  status: number;
}

export interface SyllabusListResponse {
  data: {
    content: Syllabus[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
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
  async delete(id: number): Promise<{ message: string; status: number }> {
    return apiClient.delete(`/syllabus/${id}`);
  }
}

export const syllabusService = new SyllabusService();
