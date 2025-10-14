import React, { useEffect, useState } from 'react';
import { 
  RefreshCw, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Wallet,
  Activity,
  TrendingDown,
  ArrowUpRight,
  BarChart3,
  Database,
  Zap,
  Download
} from 'lucide-react';
import adminService, { type SyncLog } from '../services/adminService';

const SyncLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    syncType: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        syncType: filters.syncType || undefined,
      };
      
      const response = await adminService.getSyncLogs(params);
      setLogs(response.items);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sync logs');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const params = {
        ...filters,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        syncType: filters.syncType || undefined,
      };
      
      const response = await adminService.getSyncLogs(params);
      setLogs(response.items);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh sync logs');
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDuration = (startedAt: string, completedAt: string) => {
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)}m ${diffSeconds % 60}s`;
    } else {
      return `${Math.floor(diffSeconds / 3600)}h ${Math.floor((diffSeconds % 3600) / 60)}m`;
    }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <AlertCircle className="h-6 w-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lịch sử đồng bộ dữ liệu</h1>
            <p className="text-green-100 text-lg">Theo dõi và quản lý đồng bộ dữ liệu</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-green-100">Tổng logs</div>
              <div className="text-2xl font-bold">{logs.length}</div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-3 rounded-xl transition-colors ${
                refreshing 
                  ? 'bg-white/10 cursor-not-allowed' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <RefreshCw className={`h-6 w-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +5
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Thành công</h3>
            <p className="text-3xl font-bold text-gray-900">
              {logs.filter(log => log.status === 'success').length}
            </p>
            <div className="mt-2 text-xs text-gray-500">Trong 24h qua</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-yellow-600 text-sm font-medium">
                <TrendingDown className="h-4 w-4 mr-1" />
                -1
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Một phần</h3>
            <p className="text-3xl font-bold text-gray-900">
              {logs.filter(log => log.status === 'partial').length}
            </p>
            <div className="mt-2 text-xs text-gray-500">Cần kiểm tra</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-red-600 text-sm font-medium">
                <TrendingDown className="h-4 w-4 mr-1" />
                -2
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Thất bại</h3>
            <p className="text-3xl font-bold text-gray-900">
              {logs.filter(log => log.status === 'failed').length}
            </p>
            <div className="mt-2 text-xs text-gray-500">Cần xử lý</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <Activity className="h-4 w-4 mr-1" />
                Total
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tổng cộng</h3>
            <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
            <div className="mt-2 text-xs text-gray-500">Tất cả logs</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-right gap-4">
          {/* Filter Label */}
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Bộ lọc</h3>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Từ ngày"
              />
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[160px]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="partial">Một phần</option>
            <option value="failed">Thất bại</option>
          </select>

          {/* Sync Type Filter */}
          <select
            value={filters.syncType}
            onChange={(e) => handleFilterChange('syncType', e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[140px]"
          >
            <option value="">Tất cả loại</option>
            <option value="manual">Thủ công</option>
            <option value="scheduled">Tự động</option>
          </select>

          {/* Limit Filter */}
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[100px]"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>

          {/* Export Button */}
          <button className="flex items-center px-4 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">
            <Download className="h-4 w-4 mr-2" />
            Xuất
          </button>

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all font-medium  ${
              refreshing 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết đồng bộ</h3>
            </div>
            <div className="text-sm text-gray-500">
              Hiển thị {logs.length} kết quả
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ví
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kết quả
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thời điểm
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {log.user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {log.wallet.walletName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.wallet.provider} • {log.wallet.walletType}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(log.status)}
                      <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                        {log.status === 'success' ? 'Thành công' : 
                         log.status === 'partial' ? 'Một phần' : 'Thất bại'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      log.syncType === 'manual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      <Zap className="h-3 w-3 mr-1" />
                      {log.syncType === 'manual' ? 'Thủ công' : 'Tự động'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-900">
                        Xử lý: {formatNumber(log.recordsProcessed)}
                      </div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-green-600 font-medium">+{formatNumber(log.recordsAdded)}</span>
                        <span className="text-blue-600 font-medium">~{formatNumber(log.recordsUpdated)}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{formatDuration(log.startedAt, log.completedAt)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{formatDate(log.completedAt)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
              <Activity className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chưa có log đồng bộ</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Hệ thống chưa có log đồng bộ dữ liệu nào. Logs sẽ xuất hiện khi có hoạt động đồng bộ.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`inline-flex items-center px-6 py-3 rounded-xl transition-colors font-medium ${
                  refreshing 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Đang tải...' : 'Làm mới dữ liệu'}
              </button>
              <button
                onClick={() => {
                  setFilters({
                    startDate: '',
                    endDate: '',
                    status: '',
                    syncType: '',
                    page: 1,
                    limit: 20
                  });
                }}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Phân trang */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} kết quả
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-md text-sm font-medium ${
                    pagination.page === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncLogsPage;
