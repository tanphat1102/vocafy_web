import { apiClient } from "./apiClient";

export interface EnrolledSyllabus {
  id: number;
  syllabusId: number;
  userId: number;
  syllabusName: string;
  syllabusDescription?: string;
  progress: number;
  enrolledAt: string;
}

export interface EnrollmentCreateRequest {
  syllabusId: number;
}

export interface EnrollmentResponse {
  data: EnrolledSyllabus;
  message: string;
  status: number;
}

export interface EnrollmentListResponse {
  data: {
    content: EnrolledSyllabus[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
}

class EnrollmentService {
  /**
   * List enrolled syllabuses
   */
  async listEnrolledSyllabuses(params?: {
    page?: number;
    size?: number;
  }): Promise<EnrollmentListResponse> {
    return apiClient.get<EnrollmentListResponse>("/enrollments", params);
  }

  /**
   * Enroll in a syllabus
   */
  async enroll(request: EnrollmentCreateRequest): Promise<EnrollmentResponse> {
    return apiClient.post<EnrollmentResponse>("/enrollments", request);
  }

  /**
   * Unenroll from a syllabus
   */
  async unenroll(
    syllabusId: number,
  ): Promise<{ message: string; status: number }> {
    return apiClient.delete(`/enrollments/${syllabusId}`);
  }

  /**
   * Get enrollment details
   */
  async getEnrollment(syllabusId: number): Promise<EnrollmentResponse> {
    return apiClient.get<EnrollmentResponse>(`/enrollments/${syllabusId}`);
  }
}

export const enrollmentService = new EnrollmentService();
