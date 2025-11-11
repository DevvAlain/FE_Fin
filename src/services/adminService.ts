import authService from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://inc-michaelina-aimpact-66b8b08a.koyeb.app";

interface AdminMetrics {
  generatedAt: string;
  totals: {
    users: number;
    activeUsers: number;
    adminUsers: number;
    newUsersLast30: number;
    wallets: number;
    activeBudgets: number;
    activeSavingGoals: number;
  };
  subscriptions: {
    active: number;
    expired: number;
    cancelled: number;
    pending: number;
    total: number;
  };
  plans: {
    active: number;
    inactive: number;
    total: number;
  };
  transactions: {
    last30Days: {
      expense: { count: number; volume: number };
      income: { count: number; volume: number };
      transfer: { count: number; volume: number };
      totalCount: number;
      totalVolume: number;
    };
  };
  sync: {
    last24Hours: {
      success: number;
      partial: number;
      failed: number;
      total: number;
    };
  };
}

interface SubscriptionPlan {
  _id: string;
  planName: string;
  planType: string;
  price: { $numberDecimal: string } | string; // Updated to reflect backend structure
  currency: string;
  billingPeriod: string;
  features: string[];
  maxWallets: number;
  maxMonthlyTransactions: number;
  aiRecommendationsLimit: number;
  maxBudgets: number;
  maxSavingGoals: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SyncLog {
  _id: string;
  user: {
    _id: string;
    email: string;
    fullName: string;
  };
  wallet: {
    _id: string;
    walletName: string;
    walletType: string;
    provider: string;
  };
  syncType: "manual" | "scheduled";
  status: "success" | "partial" | "failed";
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}

interface TransferSummary {
  range: {
    start: string | null;
    end: string | null;
  };
  currency: string;
  totalRevenue: number;
  transactionCount: number;
}

interface TransferHistoryPoint {
  period: string;
  totalRevenue: number;
  transactionCount: number;
}

interface PaymentItem {
  paymentId: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  transactionId: string | null;
  provider: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string;
}

interface TransferHistory {
  range: {
    start: string | null;
    end: string | null;
  };
  groupBy: "hour" | "day" | "month";
  timezone: string;
  points: TransferHistoryPoint[];
  items: PaymentItem[];
}

interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  data?: T;
  item?: T;
  items?: T;
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface AdminUser {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  status: string;
  role: "user" | "admin" | "staff"; // Updated to match the User type in UsersPage.tsx
  createdAt: string;
  updatedAt: string;
  isActive: boolean; // Added to match the User type in UsersPage.tsx
}

interface Review {
  paymentId: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  provider: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paidAt: string;
  review: {
    rating: number;
    content: string;
    createdAt: string;
    user: string;
  };
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  sentiment: {
    counts: {
      positive: number;
      neutral: number;
      negative: number;
    };
    percentages: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  trend: {
    last7Days: {
      count: number;
      avgRating: number;
    };
    previous7Days: {
      count: number;
      avgRating: number;
    };
    change: number;
  };
  providerBreakdown: Array<{
    provider: string;
    count: number;
    avgRating: number;
  }>;
}

interface ReviewsResponse {
  summary: ReviewSummary;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  items: Review[];
}

class AdminService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = authService.getAccessToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (
      json &&
      typeof json === "object" &&
      ("success" in json ||
        "data" in json ||
        "item" in json ||
        "items" in json ||
        "pagination" in json)
    ) {
      return json;
    }

    return {
      success: true,
      data: json as T,
    };
  }

  private extractData<T>(response: ApiResponse<T>): T {
    if (response.data !== undefined) {
      return response.data;
    }
    if (response.item !== undefined) {
      return response.item;
    }
    if (response.items !== undefined) {
      return response.items as unknown as T;
    }
    return response as unknown as T;
  }

  private extractArray<T>(response: ApiResponse<T[]>): T[] {
    if (Array.isArray(response.items)) {
      return response.items;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    const dataAsUnknown = response.data as unknown;
    if (dataAsUnknown && typeof dataAsUnknown === "object") {
      const dataRecord = dataAsUnknown as Record<string, unknown>;
      if ("items" in dataRecord && Array.isArray(dataRecord.items)) {
        return dataRecord.items as T[];
      }
    }
    if (Array.isArray(response.item as unknown as T[])) {
      return response.item as unknown as T[];
    }
    const itemAsUnknown = response.item as unknown;
    if (itemAsUnknown && typeof itemAsUnknown === "object") {
      const itemRecord = itemAsUnknown as Record<string, unknown>;
      if ("items" in itemRecord && Array.isArray(itemRecord.items)) {
        return itemRecord.items as T[];
      }
    }
    return [];
  }

  // Dashboard Metrics
  async getMetrics(): Promise<AdminMetrics> {
    try {
      const response = await this.makeRequest<AdminMetrics>(
        "/api/v1/admin/metrics/overview"
      );
      return this.extractData(response);
    } catch (error) {
      console.warn("API endpoint not available, returning mock data:", error);
      // Return mock data when API is not available
      return {
        generatedAt: new Date().toISOString(),
        totals: {
          users: 1520,
          activeUsers: 1375,
          adminUsers: 4,
          newUsersLast30: 210,
          wallets: 980,
          activeBudgets: 415,
          activeSavingGoals: 312,
        },
        subscriptions: {
          active: 420,
          expired: 55,
          cancelled: 18,
          pending: 12,
          total: 505,
        },
        plans: {
          active: 3,
          inactive: 1,
          total: 4,
        },
        transactions: {
          last30Days: {
            expense: { count: 18250, volume: 3250000000 },
            income: { count: 7400, volume: 4120000000 },
            transfer: { count: 890, volume: 560000000 },
            totalCount: 26540,
            totalVolume: 7930000000,
          },
        },
        sync: {
          last24Hours: {
            success: 38,
            partial: 5,
            failed: 2,
            total: 45,
          },
        },
      };
    }
  }

  // Payment Analytics
  async getTransferSummary(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<TransferSummary> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      const queryString = queryParams.toString();
      const endpoint = `/api/v1/admin/payments/transfer-summary${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await this.makeRequest<TransferSummary>(endpoint);
      return this.extractData(response);
    } catch (error) {
      console.warn(
        "API endpoint not available, returning mock summary data:",
        error
      );
      return {
        range: {
          start: params?.startDate ?? null,
          end: params?.endDate ?? null,
        },
        currency: "VND",
        totalRevenue: 1285000000,
        transactionCount: 245,
      };
    }
  }

  async getTransferHistory(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: "hour" | "day" | "month";
    timezone?: string;
  }): Promise<TransferHistory> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      if (params?.groupBy) queryParams.append("groupBy", params.groupBy);
      if (params?.timezone) queryParams.append("timezone", params.timezone);
      const queryString = queryParams.toString();
      const endpoint = `/api/v1/admin/payments/transfer-history${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await this.makeRequest<TransferHistory>(endpoint);
      return this.extractData(response);
    } catch (error) {
      console.warn(
        "API endpoint not available, returning mock history data:",
        error
      );
      const today = new Date();
      const points: TransferHistoryPoint[] = Array.from({ length: 7 }).map(
        (_, index) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (6 - index));
          const period = date.toISOString().split("T")[0];
          return {
            period,
            totalRevenue: 150000000 + index * 25000000,
            transactionCount: 25 + index * 3,
          };
        }
      );

      return {
        range: {
          start: params?.startDate ?? null,
          end: params?.endDate ?? null,
        },
        groupBy: params?.groupBy ?? "day",
        timezone: params?.timezone ?? "Asia/Ho_Chi_Minh",
        points,
        items: [],
      };
    }
  }

  // Subscription Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await this.makeRequest<SubscriptionPlan[]>(
        "/api/v1/admin/plans"
      );
      return this.extractArray(response);
    } catch (error) {
      console.warn("API endpoint not available, returning mock data:", error);
      // Return mock data when API is not available
      const fallbackPlans: SubscriptionPlan[] = [
        {
          _id: "1",
          planName: "Free Plan",
          planType: "free",
          price: "0",
          currency: "VND",
          billingPeriod: "monthly",
          features: [
            "1 vi lien ket",
            "100 giao dich/thang",
            "Goi y tai chinh co ban",
          ],
          maxWallets: 1,
          maxMonthlyTransactions: 100,
          aiRecommendationsLimit: 10,
          maxBudgets: 3,
          maxSavingGoals: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          planName: "Premium Plan",
          planType: "premium",
          price: "199000",
          currency: "VND",
          billingPeriod: "monthly",
          features: [
            "5 vi lien ket",
            "1000 giao dich/thang",
            "Goi y AI nang cao",
            "Bao cao chi tiet",
          ],
          maxWallets: 5,
          maxMonthlyTransactions: 1000,
          aiRecommendationsLimit: 100,
          maxBudgets: 10,
          maxSavingGoals: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "3",
          planName: "Premium Yearly",
          planType: "premium",
          price: "1990000",
          currency: "VND",
          billingPeriod: "yearly",
          features: [
            "Khong gioi han vi",
            "Khong gioi han giao dich",
            "AI toi uu",
            "Ho tro 24/7",
          ],
          maxWallets: 999,
          maxMonthlyTransactions: 999999,
          aiRecommendationsLimit: 999999,
          maxBudgets: 999,
          maxSavingGoals: 999,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      return fallbackPlans;
    }
  }

  async createPlan(
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    try {
      const response = await this.makeRequest<SubscriptionPlan>(
        "/api/v1/admin/plans",
        {
          method: "POST",
          body: JSON.stringify(planData),
        }
      );
      return this.extractData(response);
    } catch (error) {
      console.warn("API endpoint not available, simulating create:", error);
      // Simulate successful creation
      const newPlan: SubscriptionPlan = {
        _id: Date.now().toString(),
        planName: planData.planName || "New Plan",
        planType: planData.planType || "free",
        price: planData.price || "0",
        currency: planData.currency || "VND",
        billingPeriod: planData.billingPeriod || "monthly",
        features: planData.features || [],
        maxWallets: planData.maxWallets || 1,
        maxMonthlyTransactions: planData.maxMonthlyTransactions || 100,
        aiRecommendationsLimit: planData.aiRecommendationsLimit || 10,
        maxBudgets: planData.maxBudgets || 5,
        maxSavingGoals: planData.maxSavingGoals || 3,
        isActive: planData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newPlan;
    }
  }

  async updatePlan(
    planId: string,
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    try {
      const response = await this.makeRequest<SubscriptionPlan>(
        `/api/v1/admin/plans/${planId}`,
        {
          method: "PUT",
          body: JSON.stringify(planData),
        }
      );
      return this.extractData(response);
    } catch (error) {
      console.warn("API endpoint not available, simulating update:", error);
      // Simulate successful update
      const updatedPlan: SubscriptionPlan = {
        _id: planId,
        planName: planData.planName || "Updated Plan",
        planType: planData.planType || "free",
        price: planData.price || "0",
        currency: planData.currency || "VND",
        billingPeriod: planData.billingPeriod || "monthly",
        features: planData.features || [],
        maxWallets: planData.maxWallets || 1,
        maxMonthlyTransactions: planData.maxMonthlyTransactions || 100,
        aiRecommendationsLimit: planData.aiRecommendationsLimit || 10,
        maxBudgets: planData.maxBudgets || 5,
        maxSavingGoals: planData.maxSavingGoals || 3,
        isActive: planData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return updatedPlan;
    }
  }

  async deletePlan(planId: string): Promise<void> {
    try {
      await this.makeRequest(`/api/v1/admin/plans/${planId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("API endpoint not available, simulating delete:", error);
      // Simulate successful deletion
      console.log(`Plan ${planId} deleted successfully (simulated)`);
    }
  }

  // Sync Logs
  async getSyncLogs(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    syncType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SyncLog[]; pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.syncType) queryParams.append("syncType", params.syncType);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = `/api/v1/admin/sync-logs${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await this.makeRequest<SyncLog[]>(endpoint);
      const items = this.extractArray(response);
      const raw = response as unknown as {
        pagination?: Pagination;
        data?: { pagination?: Pagination };
        item?: { pagination?: Pagination };
      };
      const pagination = raw.pagination ||
        raw.data?.pagination ||
        raw.item?.pagination || {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: items.length,
          pages: 1,
        };

      return {
        items,
        pagination,
      };
    } catch (error) {
      console.warn("API endpoint not available, returning mock data:", error);
      // Return mock data when API is not available
      const mockLogs: SyncLog[] = [
        {
          _id: "1",
          user: {
            _id: "user1",
            email: "user1@example.com",
            fullName: "Nguyễn Văn A",
          },
          wallet: {
            _id: "wallet1",
            walletName: "Vietcombank",
            walletType: "bank",
            provider: "vietcombank",
          },
          syncType: "manual",
          status: "success",
          recordsProcessed: 42,
          recordsAdded: 30,
          recordsUpdated: 12,
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "2",
          user: {
            _id: "user2",
            email: "user2@example.com",
            fullName: "Trần Thị B",
          },
          wallet: {
            _id: "wallet2",
            walletName: "Techcombank",
            walletType: "bank",
            provider: "techcombank",
          },
          syncType: "scheduled",
          status: "partial",
          recordsProcessed: 25,
          recordsAdded: 20,
          recordsUpdated: 5,
          startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "3",
          user: {
            _id: "user3",
            email: "user3@example.com",
            fullName: "Lê Văn C",
          },
          wallet: {
            _id: "wallet3",
            walletName: "BIDV",
            walletType: "bank",
            provider: "bidv",
          },
          syncType: "manual",
          status: "failed",
          recordsProcessed: 0,
          recordsAdded: 0,
          recordsUpdated: 0,
          startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
      ];

      return {
        items: mockLogs,
        pagination: { page: 1, limit: 20, total: mockLogs.length, pages: 1 },
      };
    }
  }

  // Admin User Management
  async listUsers(params?: {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/admin/users${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await this.makeRequest<{
      users: AdminUser[];
      total: number;
      page: number;
      limit: number;
    }>(endpoint);
    return this.extractData(response);
  }

  async getUserDetail(userId: string): Promise<AdminUser> {
    const endpoint = `/api/v1/admin/users/${userId}`;
    const response = await this.makeRequest<AdminUser>(endpoint);
    return this.extractData(response);
  }

  async updateUser(
    userId: string,
    userData: Partial<AdminUser>
  ): Promise<AdminUser> {
    const endpoint = `/api/v1/admin/users/${userId}`;
    const response = await this.makeRequest<AdminUser>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
    return this.extractData(response);
  }

  async lockUser(userId: string): Promise<AdminUser> {
    const endpoint = `/api/v1/admin/users/${userId}/lock`;
    const response = await this.makeRequest<AdminUser>(endpoint, {
      method: "PATCH",
    });
    return this.extractData(response);
  }

  async unlockUser(userId: string): Promise<AdminUser> {
    const endpoint = `/api/v1/admin/users/${userId}/unlock`;
    const response = await this.makeRequest<AdminUser>(endpoint, {
      method: "PATCH",
    });
    return this.extractData(response);
  }

  async deleteUser(userId: string): Promise<void> {
    const endpoint = `/api/v1/admin/users/${userId}`;
    await this.makeRequest<void>(endpoint, {
      method: "DELETE",
    });
  }

  // Subscription Plans Management
  async createSubscriptionPlan(
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    const response = await this.makeRequest<SubscriptionPlan>(
      "/api/v1/admin/plans",
      {
        method: "POST",
        body: JSON.stringify(planData),
      }
    );
    return this.extractData(response);
  }

  async updateSubscriptionPlan(
    planId: string,
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    const response = await this.makeRequest<SubscriptionPlan>(
      `/api/v1/admin/plans/${planId}`,
      {
        method: "PUT",
        body: JSON.stringify(planData),
      }
    );
    return this.extractData(response);
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await this.makeRequest<SubscriptionPlan[]>(
      "/api/v1/admin/plans"
    );
    return this.extractArray(response);
  }

  async getSubscriptionPlanDetail(planId: string): Promise<SubscriptionPlan> {
    const response = await this.makeRequest<SubscriptionPlan>(
      `/api/v1/admin/plans/${planId}`
    );
    return this.extractData(response);
  }

  async deleteSubscriptionPlan(planId: string): Promise<void> {
    await this.makeRequest<void>(`/api/v1/admin/plans/${planId}`, {
      method: "DELETE",
    });
  }

  // Reviews Management
  async listReviews(params?: {
    page?: number;
    limit?: number;
    rating?: number;
    provider?: string;
  }): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams({
      ...(params?.page ? { page: params.page.toString() } : {}),
      ...(params?.limit ? { limit: params.limit.toString() } : {}),
      ...(params?.rating ? { rating: params.rating.toString() } : {}),
      ...(params?.provider ? { provider: params.provider } : {}),
    });

    const response = await this.makeRequest<ReviewsResponse>(
      `/api/v1/admin/reviews?${queryParams}`
    );
    return this.extractData(response);
  }

  async getReview(paymentId: string): Promise<Review> {
    const response = await this.makeRequest<Review>(
      `/api/v1/admin/reviews/${paymentId}`
    );
    return this.extractData(response);
  }

  async deleteReview(paymentId: string): Promise<void> {
    await this.makeRequest<void>(`/api/v1/admin/reviews/${paymentId}`, {
      method: "DELETE",
    });
  }
}

export default new AdminService();
export type {
  AdminMetrics,
  SubscriptionPlan,
  SyncLog,
  TransferSummary,
  TransferHistory,
  TransferHistoryPoint,
  PaymentItem,
  Review,
  ReviewSummary,
  ReviewsResponse,
};
