import { apiClient } from "./apiClient";

export interface GrowthRates {
  user_growth_rate: number;
  syllabus_growth_rate: number;
  vocabulary_growth_rate: number;
  active_enrollment_growth_rate: number;
  revenue_growth_rate: number;
  year: number;
  month: number;
}

export interface GrowthRatesResponse {
  success: boolean;
  message: string;
  result: GrowthRates;
}

class DashboardService {
  async getGrowthRates(): Promise<GrowthRatesResponse> {
    return apiClient.get<GrowthRatesResponse>("/dashboard/growth-rates");
  }
}

export const dashboardService = new DashboardService();
