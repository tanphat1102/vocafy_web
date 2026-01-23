import { apiClient } from "./apiClient";

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPackage {
  id: number;
  name: string;
  description?: string;
  durationDays: number;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentUrlResponse {
  paymentUrl: string;
  orderId: string;
  amount: number;
}

export interface PaymentMethodResponse {
  data: PaymentMethod;
  message: string;
  status: number;
}

export interface PaymentMethodListResponse {
  data: {
    content: PaymentMethod[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
}

export interface SubscriptionPackageResponse {
  data: SubscriptionPackage;
  message: string;
  status: number;
}

export interface SubscriptionPackageListResponse {
  data: {
    content: SubscriptionPackage[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  status: number;
}

export interface PaymentUrlResponseData {
  data: PaymentUrlResponse;
  message: string;
  status: number;
}

class PaymentService {
  /**
   * List payment methods
   */
  async listPaymentMethods(params?: {
    page?: number;
    size?: number;
  }): Promise<PaymentMethodListResponse> {
    return apiClient.get<PaymentMethodListResponse>("/payment-methods", params);
  }

  /**
   * List subscription packages
   */
  async listPackages(params?: {
    page?: number;
    size?: number;
  }): Promise<SubscriptionPackageListResponse> {
    return apiClient.get<SubscriptionPackageListResponse>(
      "/subscription-packages",
      params,
    );
  }

  /**
   * Get package by ID
   */
  async getPackageById(id: number): Promise<SubscriptionPackageResponse> {
    return apiClient.get<SubscriptionPackageResponse>(
      `/subscription-packages/${id}`,
    );
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
  ): Promise<{ message: string; status: number }> {
    return apiClient.get("/payments/callback", params);
  }
}

export const paymentService = new PaymentService();
