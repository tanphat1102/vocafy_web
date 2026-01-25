import { apiClient } from "./apiClient";

export interface PremiumPackage {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  active: boolean;
  created_at: string;
}

export interface PremiumPackageCreateRequest {
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  active: boolean;
}

export interface PremiumPackageUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  duration_days?: number;
  active?: boolean;
}

export interface PaymentUrlResponse {
  payment_url: string;
  order_id: string;
  amount: number;
}

export interface PremiumPackageResponse {
  success: boolean;
  message: string;
  result: PremiumPackage;
}

export interface PremiumPackageListResponse {
  success: boolean;
  message: string;
  result: {
    content: PremiumPackage[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

export interface PaymentUrlResponseData {
  success: boolean;
  message: string;
  result: PaymentUrlResponse;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  result: Record<string, never>;
}

class PremiumPackageService {
  /**
   * List premium packages (all fields) - paginated
   */
  async list(params?: {
    page?: number;
    size?: number;
  }): Promise<PremiumPackageListResponse> {
    return apiClient.get<PremiumPackageListResponse>(
      "/premium-packages",
      params,
    );
  }

  /**
   * Get premium package by ID (all fields)
   */
  async getById(id: number): Promise<PremiumPackageResponse> {
    return apiClient.get<PremiumPackageResponse>(`/premium-packages/${id}`);
  }

  /**
   * Create premium package
   */
  async create(
    request: PremiumPackageCreateRequest,
  ): Promise<PremiumPackageResponse> {
    return apiClient.post<PremiumPackageResponse>("/premium-packages", request);
  }

  /**
   * Update premium package
   */
  async update(
    id: number,
    request: PremiumPackageUpdateRequest,
  ): Promise<PremiumPackageResponse> {
    return apiClient.put<PremiumPackageResponse>(
      `/premium-packages/${id}`,
      request,
    );
  }

  /**
   * Delete premium package
   */
  async delete(id: number): Promise<DeleteResponse> {
    return apiClient.delete(`/premium-packages/${id}`);
  }

  /**
   * Generate payment URL for subscription
   */
  async generatePaymentUrl(packageId: number): Promise<PaymentUrlResponseData> {
    return apiClient.post<PaymentUrlResponseData>(
      `/payments/subscribe/${packageId}`,
    );
  }

  /**
   * Handle payment callback
   */
  async handlePaymentCallback(
    params: Record<string, string>,
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.get("/payments/callback", params);
  }
}

export const premiumPackageService = new PremiumPackageService();
