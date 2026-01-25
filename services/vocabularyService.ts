import { apiClient } from "./apiClient";

export interface VocabularyTerm {
  id: number;
  language_code: string;
  script_type: string;
  text_value: string;
  extra_meta: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface VocabularyMeaning {
  id: number;
  language_code: string;
  meaning_text: string;
  example_sentence: string | null;
  example_translation: string | null;
  part_of_speech: string;
  sense_order: number;
  created_at: string;
  updated_at: string;
}

export interface VocabularyMedia {
  id: number;
  media_type: string;
  url: string;
  meta: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface Vocabulary {
  id: number;
  course_id: number;
  note: string | null;
  sort_order: number;
  is_active: boolean;
  is_deleted: boolean;
  terms: VocabularyTerm[];
  meanings: VocabularyMeaning[];
  medias: VocabularyMedia[];
  created_at: string;
  updated_at: string;
}

export interface VocabularyTermCreateRequest {
  language_code: string;
  script_type: string;
  text_value: string;
  extra_meta?: unknown;
}

export interface VocabularyMeaningCreateRequest {
  language_code: string;
  meaning_text: string;
  example_sentence?: string;
  example_translation?: string;
  part_of_speech: string;
  sense_order: number;
}

export interface VocabularyMediaCreateRequest {
  media_type: string;
  url: string;
  meta?: unknown;
}

export interface VocabularyCreateRequest {
  course_id: number;
  note?: string;
  sort_order: number;
  terms: VocabularyTermCreateRequest[];
  meanings: VocabularyMeaningCreateRequest[];
  medias?: VocabularyMediaCreateRequest[];
}

export interface VocabularyUpdateRequest {
  note?: string;
  sort_order?: number;
  terms?: VocabularyTermCreateRequest[];
  meanings?: VocabularyMeaningCreateRequest[];
  medias?: VocabularyMediaCreateRequest[];
}

export interface VocabularyResponse {
  success: boolean;
  message: string;
  result: Vocabulary;
}

export interface VocabularyListResponse {
  success: boolean;
  message: string;
  result: {
    content: Vocabulary[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
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
  async delete(id: number): Promise<VocabularyResponse> {
    return apiClient.delete(`/vocabularies/${id}`);
  }
}

export const vocabularyService = new VocabularyService();
