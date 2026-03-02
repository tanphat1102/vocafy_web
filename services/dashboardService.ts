import { apiClient } from "./apiClient";

export interface DashboardMetricResult {
  count: number;
  current_month_count: number;
  previous_month_count: number;
  growth_rate: number;
  year: number;
  month: number;
}

export interface DashboardMetricResponse {
  success: boolean;
  message: string;
  result: DashboardMetricResult;
}

export interface DashboardQueryParams {
  [key: string]: string | number | boolean | undefined | null;
  year: number;
  month: number;
}

class DashboardService {
  /**
   * GET /dashboard/vocabularies
   */
  async getVocabularies(
    params: DashboardQueryParams,
  ): Promise<DashboardMetricResponse> {
    return apiClient.get<DashboardMetricResponse>("/dashboard/vocabularies", params);
  }

  /**
   * GET /dashboard/users
   */
  async getUsers(params: DashboardQueryParams): Promise<DashboardMetricResponse> {
    return apiClient.get<DashboardMetricResponse>("/dashboard/users", params);
  }

  /**
   * GET /dashboard/syllabi
   */
  async getSyllabi(params: DashboardQueryParams): Promise<DashboardMetricResponse> {
    return apiClient.get<DashboardMetricResponse>("/dashboard/syllabi", params);
  }

  /**
   * GET /dashboard/revenue
   */
  async getRevenue(params: DashboardQueryParams): Promise<DashboardMetricResponse> {
    return apiClient.get<DashboardMetricResponse>("/dashboard/revenue", params);
  }

  /**
   * GET /dashboard/growth-rates
   */
  async getGrowthRates(
    params: DashboardQueryParams,
  ): Promise<DashboardMetricResponse> {
    return apiClient.get<DashboardMetricResponse>(
      "/dashboard/growth-rates",
      params,
    );
  }

  /**
   * GET /dashboard/active-enrollments
   */
  async getActiveEnrollments(
    params: DashboardQueryParams,
  ): Promise<DashboardMetricResponse> {
    return apiClient.get<DashboardMetricResponse>(
      "/dashboard/active-enrollments",
      params,
    );
  }
}

export const dashboardService = new DashboardService();
