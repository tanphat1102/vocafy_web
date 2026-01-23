import { apiClient } from "./apiClient";

export interface VocabularyTerm {
  id?: number;
  language: string;
  value: string;
}

export interface VocabularyMeaning {
  id?: number;
  language: string;
  meaning: string;
  example?: string;
}

export interface VocabularyMedia {
  id?: number;
  type: string;
  url: string;
}

export interface Vocabulary {
  id: number;
  courseId: number;
  terms: VocabularyTerm[];
  meanings: VocabularyMeaning[];
  medias: VocabularyMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyCreateRequest {
  courseId: number;
  terms: Omit<VocabularyTerm, "id">[];
  meanings: Omit<VocabularyMeaning, "id">[];
  medias?: Omit<VocabularyMedia, "id">[];
}

export interface VocabularyUpdateRequest {
  terms: VocabularyTerm[];
  meanings: VocabularyMeaning[];
  medias?: VocabularyMedia[];
}

export interface VocabularyResponse {
  data: Vocabulary;
  message: string;
  status: number;
}

export interface VocabularyListResponse {
  data: {
    content: Vocabulary[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
}

class VocabularyService {
  /**
   * Get vocabulary by ID
   */
  async getById(id: number): Promise<VocabularyResponse> {
    return apiClient.get<VocabularyResponse>(`/vocabularies/${id}`);
  }

  /**
   * List vocabularies with pagination
   */
  async list(params?: {
    page?: number;
    size?: number;
  }): Promise<VocabularyListResponse> {
    return apiClient.get<VocabularyListResponse>("/vocabularies", params);
  }

  /**
   * Create new vocabulary
   */
  async create(request: VocabularyCreateRequest): Promise<VocabularyResponse> {
    return apiClient.post<VocabularyResponse>("/vocabularies", request);
  }

  /**
   * Update vocabulary
   */
  async update(
    id: number,
    request: VocabularyUpdateRequest,
  ): Promise<VocabularyResponse> {
    return apiClient.put<VocabularyResponse>(`/vocabularies/${id}`, request);
  }

  /**
   * Delete vocabulary
   */
  async delete(id: number): Promise<{ message: string; status: number }> {
    return apiClient.delete(`/vocabularies/${id}`);
  }
}

export const vocabularyService = new VocabularyService();
