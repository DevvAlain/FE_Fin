import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CreditCard,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wallet
} from 'lucide-react';
import adminService, {
  type TransferHistory,
  type TransferHistoryPoint,
  type TransferSummary
} from '../services/adminService';

type GroupByOption = 'hour' | 'day' | 'month';

const PAYMENT_GRADIENT = 'from-indigo-500 via-sky-500 to-blue-500';

const PaymentsPage: React.FC = () => {
  const [summary, setSummary] = useState<TransferSummary | null>(null);
  const [history, setHistory] = useState<TransferHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    groupBy: GroupByOption;
  }>({
    startDate: '',
    endDate: '',
    groupBy: 'day'
  });

  useEffect(() => {
    void loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.groupBy]);

  const loadAnalytics = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      setError(null);
      const params = {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };

      const [summaryResponse, historyResponse] = await Promise.all([
        adminService.getTransferSummary(params),
        adminService.getTransferHistory({
          ...params,
          groupBy: filters.groupBy
        })
      ]);

      setSummary(summaryResponse);
      setHistory(historyResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load payment analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = (field: 'startDate' | 'endDate' | 'groupBy', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void loadAnalytics();
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      groupBy: 'day'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: summary?.currency ?? 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const chartData = useMemo(() => {
    const points = history?.points ?? [];
    const maxValue = Math.max(...points.map((point) => point.totalRevenue), 1);
    const maxTransactions = Math.max(...points.map((point) => point.transactionCount), 1);
    return {
      points,
      maxValue,
      maxTransactions
    };
  }, [history]);

  const buildAreaPath = (points: TransferHistoryPoint[]): string => {
    if (!points.length) return '';
    const width = 600;
    const height = 240;
    const padding = 24;
    const maxValue = Math.max(...points.map((point) => point.totalRevenue), 1);

    const step = (width - padding * 2) / Math.max(points.length - 1, 1);
    const path = points
      .map((point, index) => {
        const x = padding + index * step;
        const ratio = point.totalRevenue / maxValue;
        const y = height - padding - ratio * (height - padding * 2);
        const command = index === 0 ? `M ${x},${y}` : `L ${x},${y}`;
        return command;
      })
      .join(' ');

    const lastX = padding + (points.length - 1) * step;
    const baseY = height - padding;
    return `${path} L ${lastX},${baseY} L ${padding},${baseY} Z`;
  };

  const groupByLabel =
    filters.groupBy === 'day' ? 'day' : filters.groupBy === 'month' ? 'month' : 'hour';

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white bg-gradient-to-r ${PAYMENT_GRADIENT} shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-sky-100 font-semibold">Payments</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Revenue Dashboard</h1>
            <p className="text-sky-100 mt-3 max-w-2xl">
              Track bank transfer performance, successful payouts, and revenue trends across your
              selected time window.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2 text-sm font-medium"
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </button>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:text-blue-700 rounded-xl px-4 py-2 text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-600 block mb-2">Start date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => handleFilterChange('startDate', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-600 block mb-2">End date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => handleFilterChange('endDate', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="w-full md:w-auto min-w-[160px]">
            <label className="text-sm font-medium text-gray-600 block mb-2">Group by</label>
            <select
              value={filters.groupBy}
              onChange={(event) => handleFilterChange('groupBy', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
          <option value="month">Month</option>
        </select>
      </div>
    </div>
  </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-6 flex items-start gap-3">
          <BarChart3 className="h-5 w-5 mt-1 text-red-500" />
          <div>
            <h3 className="text-sm font-semibold mb-1">Unable to load payment analytics</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-sm text-gray-500">Total transfer revenue</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {summary ? formatCurrency(summary.totalRevenue) : '—'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.range.start ? `From ${new Date(summary.range.start).toLocaleDateString('vi-VN')}` : 'Entire history'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Wallet className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-sm text-gray-500">Transaction count</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {summary ? formatNumber(summary.transactionCount) : '—'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.range.end ? `Until ${new Date(summary.range.end).toLocaleDateString('vi-VN')}` : 'Up to now'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-sm text-gray-500">Average revenue per transfer</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {summary && summary.transactionCount
              ? formatCurrency(summary.totalRevenue / Math.max(summary.transactionCount, 1))
              : '—'}
          </p>
          <p className="text-xs text-gray-400 mt-2">Figures follow the current filters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue trend</h3>
              <p className="text-sm text-gray-500">Total revenue by {groupByLabel}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" />
              {summary ? summary.currency : 'VND'}
            </div>
          </div>

          <div className="px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : chartData.points.length === 0 ? (
              <div className="text-center h-60 flex flex-col items-center justify-center text-gray-500">
                <CreditCard className="h-8 w-8 mb-3 text-gray-400" />
                <p className="font-medium">No data for this filter</p>
                <p className="text-sm text-gray-400 mt-1">Adjust the date range to view more insights.</p>
              </div>
            ) : (
              <div className="relative">
                <svg viewBox="0 0 600 240" className="w-full h-60">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={buildAreaPath(chartData.points)}
                    fill="url(#revenueGradient)"
                    className="transition-all duration-300 ease-out"
                  />
                  {chartData.points.map((point, index) => {
                    const width = 600;
                    const height = 240;
                    const padding = 24;
                    const step = (width - padding * 2) / Math.max(chartData.points.length - 1, 1);
                    const x = padding + index * step;
                    const maxValue = Math.max(chartData.maxValue, 1);
                    const y =
                      height - padding - (point.totalRevenue / maxValue) * (height - padding * 2);

                    return (
                      <g key={point.period}>
                        <circle cx={x} cy={y} r={4} className="fill-indigo-500 stroke-white stroke-2" />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {formatCurrency(point.totalRevenue)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick stats</h3>
              <p className="text-sm text-gray-500">Compare transactions and revenue</p>
            </div>
            <div className="text-sm text-indigo-600 font-medium">By {groupByLabel}</div>
          </div>
          <div className="divide-y divide-gray-100">
            {(history?.points ?? []).slice(-8).map((point) => (
              <div key={point.period} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{point.period}</p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(point.transactionCount)} transfers
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(point.totalRevenue)}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-2 text-xs text-gray-500">
                    <div className="w-20 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-sky-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (point.transactionCount / Math.max(chartData.maxTransactions, 1)) * 100
                            )
                          )}%`
                        }}
                      />
                    </div>
                    {formatNumber(point.transactionCount)}
                  </div>
                </div>
              </div>
            ))}
            {!history?.points?.length && !loading && (
              <div className="px-6 py-14 text-center text-gray-500 text-sm">
                No data available for the current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
