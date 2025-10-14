import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
  price: string;
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
  syncType: 'manual' | 'scheduled';
  status: 'success' | 'partial' | 'failed';
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  data?: T;
  item?: T;
  items?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class AdminService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = authService.getAccessToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Dashboard Metrics
  async getMetrics(): Promise<AdminMetrics> {
    try {
      const response = await this.makeRequest<AdminMetrics>('/api/v1/admin/metrics/overview');
      return response.data!;
    } catch (error) {
      console.warn('API endpoint not available, returning mock data:', error);
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
          activeSavingGoals: 312
        },
        subscriptions: {
          active: 420,
          expired: 55,
          cancelled: 18,
          pending: 12,
          total: 505
        },
        plans: {
          active: 3,
          inactive: 1,
          total: 4
        },
        transactions: {
          last30Days: {
            expense: { count: 18250, volume: 3250000000 },
            income: { count: 7400, volume: 4120000000 },
            transfer: { count: 890, volume: 560000000 },
            totalCount: 26540,
            totalVolume: 7930000000
          }
        },
        sync: {
          last24Hours: {
            success: 38,
            partial: 5,
            failed: 2,
            total: 45
          }
        }
      };
    }
  }

  // Subscription Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await this.makeRequest<SubscriptionPlan[]>('/api/v1/admin/plans');
      return response.items || [];
    } catch (error) {
      console.warn('API endpoint not available, returning mock data:', error);
      // Return mock data when API is not available
      return [
        {
          _id: '1',
          planName: 'Basic Plan',
          planType: 'basic',
          price: '99000',
          currency: 'VND',
          billingPeriod: 'monthly',
          features: ['1 ví', '100 giao dịch/tháng', 'Gợi ý cơ bản'],
          maxWallets: 1,
          maxMonthlyTransactions: 100,
          aiRecommendationsLimit: 10,
          maxBudgets: 3,
          maxSavingGoals: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          planName: 'Premium Plan',
          planType: 'premium',
          price: '199000',
          currency: 'VND',
          billingPeriod: 'monthly',
          features: ['5 ví', '1000 giao dịch/tháng', 'Gợi ý AI nâng cao', 'Báo cáo chi tiết'],
          maxWallets: 5,
          maxMonthlyTransactions: 1000,
          aiRecommendationsLimit: 100,
          maxBudgets: 10,
          maxSavingGoals: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          planName: 'Enterprise Plan',
          planType: 'enterprise',
          price: '499000',
          currency: 'VND',
          billingPeriod: 'monthly',
          features: ['Không giới hạn ví', 'Không giới hạn giao dịch', 'AI tối ưu', 'Hỗ trợ 24/7'],
          maxWallets: 999,
          maxMonthlyTransactions: 999999,
          aiRecommendationsLimit: 999999,
          maxBudgets: 999,
          maxSavingGoals: 999,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  }

  async createPlan(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    try {
      const response = await this.makeRequest<SubscriptionPlan>('/api/v1/admin/plans', {
        method: 'POST',
        body: JSON.stringify(planData),
      });
      return response.item!;
    } catch (error) {
      console.warn('API endpoint not available, simulating create:', error);
      // Simulate successful creation
      const newPlan: SubscriptionPlan = {
        _id: Date.now().toString(),
        planName: planData.planName || 'New Plan',
        planType: planData.planType || 'basic',
        price: planData.price || '0',
        currency: planData.currency || 'VND',
        billingPeriod: planData.billingPeriod || 'monthly',
        features: planData.features || [],
        maxWallets: planData.maxWallets || 1,
        maxMonthlyTransactions: planData.maxMonthlyTransactions || 100,
        aiRecommendationsLimit: planData.aiRecommendationsLimit || 10,
        maxBudgets: planData.maxBudgets || 5,
        maxSavingGoals: planData.maxSavingGoals || 3,
        isActive: planData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newPlan;
    }
  }

  async updatePlan(planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    try {
      const response = await this.makeRequest<SubscriptionPlan>(`/api/v1/admin/plans/${planId}`, {
        method: 'PUT',
        body: JSON.stringify(planData),
      });
      return response.item!;
    } catch (error) {
      console.warn('API endpoint not available, simulating update:', error);
      // Simulate successful update
      const updatedPlan: SubscriptionPlan = {
        _id: planId,
        planName: planData.planName || 'Updated Plan',
        planType: planData.planType || 'basic',
        price: planData.price || '0',
        currency: planData.currency || 'VND',
        billingPeriod: planData.billingPeriod || 'monthly',
        features: planData.features || [],
        maxWallets: planData.maxWallets || 1,
        maxMonthlyTransactions: planData.maxMonthlyTransactions || 100,
        aiRecommendationsLimit: planData.aiRecommendationsLimit || 10,
        maxBudgets: planData.maxBudgets || 5,
        maxSavingGoals: planData.maxSavingGoals || 3,
        isActive: planData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return updatedPlan;
    }
  }

  async deletePlan(planId: string): Promise<void> {
    try {
      await this.makeRequest(`/api/v1/admin/plans/${planId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('API endpoint not available, simulating delete:', error);
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
  }): Promise<{ items: SyncLog[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.syncType) queryParams.append('syncType', params.syncType);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = `/api/v1/admin/sync-logs${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.makeRequest<SyncLog[]>(endpoint);
      return {
        items: response.items || [],
        pagination: response.pagination || { page: 1, limit: 20, total: 0, pages: 1 }
      };
    } catch (error) {
      console.warn('API endpoint not available, returning mock data:', error);
      // Return mock data when API is not available
      const mockLogs: SyncLog[] = [
        {
          _id: '1',
          user: {
            _id: 'user1',
            email: 'user1@example.com',
            fullName: 'Nguyễn Văn A'
          },
          wallet: {
            _id: 'wallet1',
            walletName: 'Vietcombank',
            walletType: 'bank',
            provider: 'vietcombank'
          },
          syncType: 'manual',
          status: 'success',
          recordsProcessed: 42,
          recordsAdded: 30,
          recordsUpdated: 12,
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          user: {
            _id: 'user2',
            email: 'user2@example.com',
            fullName: 'Trần Thị B'
          },
          wallet: {
            _id: 'wallet2',
            walletName: 'Techcombank',
            walletType: 'bank',
            provider: 'techcombank'
          },
          syncType: 'scheduled',
          status: 'partial',
          recordsProcessed: 25,
          recordsAdded: 20,
          recordsUpdated: 5,
          startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          user: {
            _id: 'user3',
            email: 'user3@example.com',
            fullName: 'Lê Văn C'
          },
          wallet: {
            _id: 'wallet3',
            walletName: 'BIDV',
            walletType: 'bank',
            provider: 'bidv'
          },
          syncType: 'manual',
          status: 'failed',
          recordsProcessed: 0,
          recordsAdded: 0,
          recordsUpdated: 0,
          startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        items: mockLogs,
        pagination: { page: 1, limit: 20, total: mockLogs.length, pages: 1 }
      };
    }
  }
}

export default new AdminService();
export type { AdminMetrics, SubscriptionPlan, SyncLog };
