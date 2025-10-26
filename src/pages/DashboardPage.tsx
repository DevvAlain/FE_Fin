import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserCog,
  UserPlus,
  Wallet,
  Target,
  PiggyBank,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Eye,
  DollarSign,
  Zap,
  Package,
} from "lucide-react";
import adminService, { type AdminMetrics } from "../services/adminService";

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lỗi tải dữ liệu</h1>
              <p className="text-red-100 text-lg">
                Không thể kết nối đến server
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-red-100">Trạng thái</div>
                <div className="text-2xl font-bold">Lỗi</div>
              </div>
              <button
                onClick={loadMetrics}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Không thể tải dữ liệu
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={loadMetrics}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                <RefreshCw className="h-5 w-5 mr-2" />
                Thử lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Tổng quan hệ thống và thống kê
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-blue-100">Cập nhật lần cuối</div>
              <div className="font-semibold">
                {new Date(metrics.generatedAt).toLocaleString("vi-VN")}
              </div>
            </div>
            <button
              onClick={loadMetrics}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Tổng người dùng
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(metrics.totals.users)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Tăng trưởng so với tháng trước
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +8%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Người dùng hoạt động
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(metrics.totals.activeUsers)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Đang sử dụng hệ thống
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <UserCog className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <Eye className="h-4 w-4 mr-1" />
                Stable
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Quản trị viên
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(metrics.totals.adminUsers)}
            </p>
            <div className="mt-2 text-xs text-gray-500">Có quyền quản trị</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +15%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Người dùng mới
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(metrics.totals.newUsersLast30)}
            </p>
            <div className="mt-2 text-xs text-gray-500">Trong 30 ngày qua</div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-indigo-100 text-sm">Tổng ví</div>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.totals.wallets)}
              </div>
            </div>
          </div>
          <div className="flex items-center text-indigo-100 text-sm">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            +5% so với tháng trước
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-yellow-100 text-sm">Ngân sách</div>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.totals.activeBudgets)}
              </div>
            </div>
          </div>
          <div className="flex items-center text-yellow-100 text-sm">
            <Activity className="h-4 w-4 mr-1" />
            Đang hoạt động
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-pink-100 text-sm">Mục tiêu tiết kiệm</div>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.totals.activeSavingGoals)}
              </div>
            </div>
          </div>
          <div className="flex items-center text-pink-100 text-sm">
            <Zap className="h-4 w-4 mr-1" />
            Đang theo dõi
          </div>
        </div>
      </div>

      {/* Transaction Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Giao dịch 30 ngày qua
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Tháng hiện tại
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Chi tiêu
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.transactions.last30Days.expense.count)}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  {formatCurrency(
                    metrics.transactions.last30Days.expense.volume
                  )}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Thu nhập
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.transactions.last30Days.income.count)}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {formatCurrency(
                    metrics.transactions.last30Days.income.volume
                  )}
                </p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Chuyển khoản
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.transactions.last30Days.transfer.count)}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {formatCurrency(
                    metrics.transactions.last30Days.transfer.volume
                  )}
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Tổng cộng
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.transactions.last30Days.totalCount)}
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  {formatCurrency(metrics.transactions.last30Days.totalVolume)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Trạng thái hệ thống
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                24h qua
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Gói đăng ký</div>
                    <div className="text-sm text-gray-600">
                      Hoạt động: {metrics.subscriptions.active}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.subscriptions.active}
                  </div>
                  <div className="text-xs text-gray-500">
                    / {metrics.subscriptions.total}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <PieChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Đồng bộ dữ liệu
                    </div>
                    <div className="text-sm text-gray-600">
                      Thành công: {metrics.sync.last24Hours.success}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.sync.last24Hours.success}
                  </div>
                  <div className="text-xs text-gray-500">
                    / {metrics.sync.last24Hours.total}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Gói kế hoạch
                    </div>
                    <div className="text-sm text-gray-600">
                      Hoạt động: {metrics.plans.active}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">
                    {metrics.plans.active}
                  </div>
                  <div className="text-xs text-gray-500">
                    / {metrics.plans.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
            <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">
                Quản lý người dùng
              </div>
              <div className="text-sm text-gray-600">Xem và chỉnh sửa</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/plans")}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
            <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Gói đăng ký</div>
              <div className="text-sm text-gray-600">Tạo và quản lý</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/sync-logs")}
            className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
            <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Đồng bộ dữ liệu</div>
              <div className="text-sm text-gray-600">Theo dõi và kiểm tra</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/payments")}
            className="flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3 group-hover:bg-indigo-200 transition-colors">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Payments</div>
              <div className="text-sm text-gray-600">Analytics & trends</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
