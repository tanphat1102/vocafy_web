import { apiClient } from "./apiClient";

export interface PaymentMethod {
  id: number;
  provider: string;
  description: string;
  active: boolean;
}

export interface PaymentMethodCreateRequest {
  provider: string;
  description: string;
}

export interface PaymentMethodUpdateRequest {
  provider?: string;
  description?: string;
}

export interface PaymentMethodToggleActiveRequest {
  active: boolean;
}

export interface PaymentMethodResponse {
  success: boolean;
  message: string;
  result: PaymentMethod;
}

export interface PaymentMethodListResponse {
  success: boolean;
  message: string;
  result: {
    content: PaymentMethod[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

class PaymentMethodService {
  /**
   * List payment methods
   */
  async list(params?: {
    page?: number;
    size?: number;
  }): Promise<PaymentMethodListResponse> {
    return apiClient.get<PaymentMethodListResponse>("/payment-methods", params);
  }

  /**
   * Get payment method by ID
   */
  async getById(id: number): Promise<PaymentMethodResponse> {
    return apiClient.get<PaymentMethodResponse>(`/payment-methods/${id}`);
  }

  /**
   * Create payment method (admin, manager)
   */
  async create(
    request: PaymentMethodCreateRequest,
  ): Promise<PaymentMethodResponse> {
    return apiClient.post<PaymentMethodResponse>("/payment-methods", request);
  }

  /**
   * Update payment method (admin, manager)
   */
  async update(
    id: number,
    request: PaymentMethodUpdateRequest,
  ): Promise<PaymentMethodResponse> {
    return apiClient.put<PaymentMethodResponse>(
      `/payment-methods/${id}`,
      request,
    );
  }

  /**
   * Toggle payment method active status (admin, manager)
   */
  async toggleActive(
    id: number,
    request: PaymentMethodToggleActiveRequest,
  ): Promise<PaymentMethodResponse> {
    return apiClient.patch<PaymentMethodResponse>(
      `/payment-methods/${id}/active`,
      request,
    );
  }
}

export const paymentMethodService = new PaymentMethodService();
