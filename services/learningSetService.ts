import { apiClient } from "./apiClient";

export interface LearningSetVocabulary {
  id: number;
  terms: Array<{ language: string; value: string }>;
  meanings: Array<{ language: string; meaning: string; example?: string }>;
  medias: Array<{ type: string; url: string }>;
}

export interface LearningSet {
  id: number;
  userId: number;
  syllabusId: number;
  vocabularies: LearningSetVocabulary[];
  generatedAt: string;
}

export interface LearningSetGenerateRequest {
  syllabusId: number;
  limit?: number;
}

export interface LearningSetCompleteRequest {
  learningSetId: number;
  vocabularyResults: Array<{
    vocabularyId: number;
    difficulty: "EASY" | "MEDIUM" | "HARD" | "AGAIN";
  }>;
}

export interface LearningSetCompleteResponse {
  message: string;
  nextReviewDate: string;
  vocabulariesUpdated: number;
}

export interface LearningSetResponse {
  data: LearningSet;
  message: string;
  status: number;
}

export interface LearningSetCompleteResponseData {
  data: LearningSetCompleteResponse;
  message: string;
  status: number;
}

class LearningSetService {
  /**
   * Generate a new learning set
   */
  async generate(
    request: LearningSetGenerateRequest,
  ): Promise<LearningSetResponse> {
    return apiClient.post<LearningSetResponse>("/learning-sets", request);
  }

  /**
   * Complete a learning set with vocabulary results
   */
  async complete(
    request: LearningSetCompleteRequest,
  ): Promise<LearningSetCompleteResponseData> {
    return apiClient.post<LearningSetCompleteResponseData>(
      "/learning-sets/complete",
      request,
    );
  }

  /**
   * Get today's learning set for a syllabus
   */
  async getTodaySet(syllabusId: number): Promise<LearningSetResponse> {
    return apiClient.get<LearningSetResponse>(
      `/learning-sets/today/${syllabusId}`,
    );
  }
}

export const learningSetService = new LearningSetService();
