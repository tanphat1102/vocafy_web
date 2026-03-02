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
  url: string;
  amount: number;
  ref1: string;
}

export interface PremiumPackagePageResult {
  content: PremiumPackage[];
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  is_first: boolean;
  is_last: boolean;
  totalElements?: number;
  totalPages?: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export interface PremiumPackageResponse {
  success: boolean;
  message: string;
  result: PremiumPackage;
}

export interface PremiumPackageListResponse {
  success: boolean;
  message: string;
  result: PremiumPackagePageResult;
}

export interface PaymentUrlResponseData {
  success: boolean;
  message: string;
  result: PaymentUrlResponse;
}

export interface PaymentTransactionCheckResult {
  is_registration_successful: boolean;
  payment_status: "PENDING" | "SUCCESS" | "PAID" | "COMPLETED" | "FAILED" | string;
  subscription_plan?: string;
  subscription_end_at?: string | null;
  latest_transaction_status?: string | null;
  latest_transaction_amount?: number;
}

export interface CheckTransactionResponse {
  success: boolean;
  message: string;
  result?: PaymentTransactionCheckResult | null;
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
   * List active packages from payment endpoint (public flow)
   */
  async listActivePackages(params?: {
    page?: number;
    size?: number;
  }): Promise<PremiumPackageListResponse> {
    return apiClient.get<PremiumPackageListResponse>("/payments/packages", params);
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
   * Check whether the transfer has been received
   */
  async checkTransaction(): Promise<CheckTransactionResponse> {
    return apiClient.get<CheckTransactionResponse>("/payments/check-transaction");
  }

  /**
   * Determine whether transaction check response indicates success.
   */
  isTransactionSuccessful(response: CheckTransactionResponse): boolean {
    const plan = (response.result?.subscription_plan || "").toUpperCase();
    return !!(
      response.success &&
      response.result &&
      response.result.is_registration_successful === true &&
      plan === "VIP"
    );
  }

  /**
   * Determine whether transaction is still in processing state.
   */
  isTransactionPending(response: CheckTransactionResponse): boolean {
    if (!response.success || !response.result) return false;
    return (response.result.payment_status || "").toUpperCase() === "PENDING";
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
