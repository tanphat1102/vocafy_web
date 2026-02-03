import { apiClient } from "./apiClient";

export type SubscriptionPlan = "FREE" | "PREMIUM" | "PREMIUM_PLUS";

export interface Subscription {
  plan: SubscriptionPlan;
  start_at: string;
  end_at: string;
  updated_at: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  result: Subscription;
}

export interface SubscriptionTransaction {
  id: string;
  user: {
    id: string;
    email: string;
  };
  payment_method_id: number;
  amount: number;
  status: "DEBIT" | "CREDIT";
  note: string;
  created_at: string;
}

export interface SubscriptionTransactionListResponse {
  success: boolean;
  message: string;
  result: {
    content: SubscriptionTransaction[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    is_first: boolean;
    is_last: boolean;
  };
}

class SubscriptionService {
  /**
   * Get subscription by user id (admin, manager only)
   * @param userId - The user ID
   * @returns Subscription data
   */
  async getSubscriptionByUserId(userId: string): Promise<Subscription> {
    const response = await apiClient.get<SubscriptionResponse>(
      `/subscriptions/${userId}`,
    );
    return response.result;
  }

  /**
   * Get current user's subscription (all roles)
   * @returns Current user's subscription data
   */
  async getMySubscription(): Promise<Subscription> {
    const response =
      await apiClient.get<SubscriptionResponse>("/subscriptions/me");
    return response.result;
  }

  /**
   * Get all subscription transactions with pagination
   * @param page - Page number (default: 0)
   * @param size - Page size (default: 10)
   * @returns Paginated subscription transactions
   */
  async getSubscriptionTransactions(
    page: number = 0,
    size: number = 10,
  ): Promise<SubscriptionTransactionListResponse["result"]> {
    const response = await apiClient.get<SubscriptionTransactionListResponse>(
      `/subscription-transactions?page=${page}&size=${size}`,
    );
    return response.result;
  }
}

export const subscriptionService = new SubscriptionService();
