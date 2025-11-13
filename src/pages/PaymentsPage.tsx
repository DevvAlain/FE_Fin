import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CreditCard,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wallet,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  User,
  Mail,
} from "lucide-react";
import adminService, {
  type TransferHistory,
  type TransferHistoryPoint,
  type TransferSummary,
} from "../services/adminService";

type GroupByOption = "hour" | "day" | "month";

const PAYMENT_GRADIENT = "from-indigo-500 via-sky-500 to-blue-500";

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
    startDate: "",
    endDate: "",
    groupBy: "day",
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
        endDate: filters.endDate || undefined,
      };

      const [summaryResponse, historyResponse] = await Promise.all([
        adminService.getTransferSummary(params),
        adminService.getTransferHistory({
          ...params,
          groupBy: filters.groupBy,
        }),
      ]);

      setSummary(summaryResponse);
      setHistory(historyResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load payment analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = (
    field: "startDate" | "endDate" | "groupBy",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void loadAnalytics();
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      groupBy: "day",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: summary?.currency ?? "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const chartData = useMemo(() => {
    const points = history?.points ?? [];
    const maxValue = Math.max(...points.map((point) => point.totalRevenue), 1);
    const maxTransactions = Math.max(
      ...points.map((point) => point.transactionCount),
      1
    );
    return {
      points,
      maxValue,
      maxTransactions,
    };
  }, [history]);

  // Chart rendering helpers (smooth area + axes + tooltip)
  const CHART_W = 700;
  const CHART_H = 300;
  const MARGIN = { top: 12, right: 24, bottom: 40, left: 56 };

  const innerW = CHART_W - MARGIN.left - MARGIN.right;
  const innerH = CHART_H - MARGIN.top - MARGIN.bottom;

  const getX = (index: number, total: number) => {
    if (total <= 1) return MARGIN.left + innerW / 2;
    const step = innerW / (total - 1);
    return MARGIN.left + index * step;
  };

  const getY = (value: number, max: number) => {
    const v = Math.max(0, Math.min(value, max));
    const ratio = max === 0 ? 0 : v / max;
    return MARGIN.top + innerH * (1 - ratio);
  };

  const buildSmoothLinePath = (
    pts: TransferHistoryPoint[],
    max: number
  ): string => {
    if (!pts.length) return "";
    if (pts.length === 1) {
      const x = getX(0, 1);
      const y = getY(pts[0].totalRevenue, max);
      return `M ${x},${y}`;
    }

    const coords = pts.map((p, i) => ({
      x: getX(i, pts.length),
      y: getY(p.totalRevenue, max),
    }));

    const smoothing = 0.18; // Catmull-Rom like
    let d = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i - 1] ?? coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] ?? coords[i + 1];

      const c1x = p1.x + (p2.x - p0.x) * smoothing;
      const c1y = p1.y + (p2.y - p0.y) * smoothing;
      const c2x = p2.x - (p3.x - p1.x) * smoothing;
      const c2y = p2.y - (p3.y - p1.y) * smoothing;

      d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const buildSmoothAreaPath = (
    pts: TransferHistoryPoint[],
    max: number
  ): string => {
    if (!pts.length) return "";
    const line = buildSmoothLinePath(pts, max);
    const lastX = getX(Math.max(pts.length - 1, 0), pts.length);
    const firstX = getX(0, pts.length);
    const baseY = MARGIN.top + innerH;
    return `${line} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
  };

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const handleMouseMove = (evt: React.MouseEvent<SVGSVGElement>) => {
    if (!chartData.points.length) return;
    const bounds = (evt.target as SVGElement)
      .closest("svg")
      ?.getBoundingClientRect();
    if (!bounds) return;
    const x = evt.clientX - bounds.left - MARGIN.left;
    const clamped = Math.max(0, Math.min(x, innerW));
    const index = Math.round(
      (clamped / innerW) * (chartData.points.length - 1)
    );
    setHoverIndex(index);
  };
  const handleMouseLeave = () => setHoverIndex(null);

  const groupByLabel =
    filters.groupBy === "day"
      ? "day"
      : filters.groupBy === "month"
      ? "month"
      : "hour";

  return (
    <div className="space-y-6">
      <div
        className={`rounded-3xl p-8 text-white bg-gradient-to-r ${PAYMENT_GRADIENT} shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-sky-100 font-semibold">
              Payments
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Revenue Dashboard
            </h1>
            <p className="text-sky-100 mt-3 max-w-2xl">
              Track bank transfer performance, successful payouts, and revenue
              trends across your selected time window.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2 text-sm font-medium">
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:text-blue-700 rounded-xl px-4 py-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Start date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) =>
                handleFilterChange("startDate", event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-600 block mb-2">
              End date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) =>
                handleFilterChange("endDate", event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="w-full md:w-auto min-w-[160px]">
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Group by
            </label>
            <select
              value={filters.groupBy}
              onChange={(event) =>
                handleFilterChange("groupBy", event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition">
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
            <h3 className="text-sm font-semibold mb-1">
              Unable to load payment analytics
            </h3>
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
            {summary ? formatCurrency(summary.totalRevenue) : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.range.start
              ? `From ${new Date(summary.range.start).toLocaleDateString(
                  "vi-VN"
                )}`
              : "Entire history"}
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
            {summary ? formatNumber(summary.transactionCount) : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.range.end
              ? `Until ${new Date(summary.range.end).toLocaleDateString(
                  "vi-VN"
                )}`
              : "Up to now"}
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
              ? formatCurrency(
                  summary.totalRevenue / Math.max(summary.transactionCount, 1)
                )
              : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Figures follow the current filters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue trend
              </h3>
              <p className="text-sm text-gray-500">
                Total revenue by {groupByLabel}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" />
              {summary ? summary.currency : "VND"}
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
                <p className="text-sm text-gray-400 mt-1">
                  Adjust the date range to view more insights.
                </p>
              </div>
            ) : (
              <div className="relative">
                <svg
                  viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                  className="w-full h-72"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1">
                      <stop
                        offset="0%"
                        stopColor="#5b7cfa"
                        stopOpacity="0.45"
                      />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineStroke" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>

                  {/* Y gridlines */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    const y = MARGIN.top + (innerH / 4) * i;
                    const val = Math.round(chartData.maxValue * (1 - i / 4));
                    return (
                      <g key={`gy-${i}`}>
                        <line
                          x1={MARGIN.left}
                          x2={MARGIN.left + innerW}
                          y1={y}
                          y2={y}
                          className="stroke-gray-100"
                        />
                        <text
                          x={MARGIN.left - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[10px] fill-gray-400">
                          {formatCurrency(val)}
                        </text>
                      </g>
                    );
                  })}

                  {/* X axis ticks */}
                  {chartData.points.map((p, i) => {
                    const total = chartData.points.length;
                    const show =
                      total <= 8 ||
                      i === 0 ||
                      i === Math.floor(total / 2) ||
                      i === total - 1;
                    if (!show) return null;
                    const x = getX(i, total);
                    return (
                      <g key={`gx-${p.period}`}>
                        <line
                          x1={x}
                          x2={x}
                          y1={MARGIN.top}
                          y2={MARGIN.top + innerH}
                          className="stroke-gray-50"
                        />
                        <text
                          x={x}
                          y={MARGIN.top + innerH + 16}
                          textAnchor="middle"
                          className="text-[10px] fill-gray-400">
                          {p.period}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill */}
                  <path
                    d={buildSmoothAreaPath(
                      chartData.points,
                      chartData.maxValue
                    )}
                    fill="url(#revenueGradient)"
                  />
                  {/* Line stroke */}
                  <path
                    d={buildSmoothLinePath(
                      chartData.points,
                      chartData.maxValue
                    )}
                    fill="none"
                    stroke="url(#lineStroke)"
                    strokeWidth={3}
                  />

                  {/* Hover marker and tooltip line */}
                  {hoverIndex !== null && chartData.points[hoverIndex] && (
                    <g>
                      <line
                        x1={getX(hoverIndex, chartData.points.length)}
                        x2={getX(hoverIndex, chartData.points.length)}
                        y1={MARGIN.top}
                        y2={MARGIN.top + innerH}
                        className="stroke-indigo-200"
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx={getX(hoverIndex, chartData.points.length)}
                        cy={getY(
                          chartData.points[hoverIndex].totalRevenue,
                          chartData.maxValue
                        )}
                        r={5}
                        className="fill-white stroke-indigo-500"
                        strokeWidth={2}
                      />
                    </g>
                  )}
                </svg>

                {/* Tooltip */}
                {hoverIndex !== null && chartData.points[hoverIndex] && (
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-4 rounded-xl bg-white shadow-lg border border-gray-100 px-3 py-2 text-xs"
                    style={{
                      left: `${
                        (getX(hoverIndex, chartData.points.length) / CHART_W) *
                        100
                      }%`,
                      top: `${
                        (getY(
                          chartData.points[hoverIndex].totalRevenue,
                          chartData.maxValue
                        ) /
                          CHART_H) *
                        100
                      }%`,
                    }}>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(
                        chartData.points[hoverIndex].totalRevenue
                      )}
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {chartData.points[hoverIndex].period} ·{" "}
                      {formatNumber(
                        chartData.points[hoverIndex].transactionCount
                      )}{" "}
                      tx
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick stats
              </h3>
              <p className="text-sm text-gray-500">
                Compare transactions and revenue
              </p>
            </div>
            <div className="text-sm text-indigo-600 font-medium">
              By {groupByLabel}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {(history?.points ?? []).slice(-8).map((point) => (
              <div
                key={point.period}
                className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {point.period}
                  </p>
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
                              (point.transactionCount /
                                Math.max(chartData.maxTransactions, 1)) *
                                100
                            )
                          )}%`,
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

      {/* Payment Items List */}
      {history?.items && history.items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Payments
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest 100 transactions with detailed timestamps
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {history.items.length} transactions
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Paid At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.items.map((item) => (
                  <tr
                    key={item.paymentId}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {item.user?.name || "Unknown User"}
                          </div>
                          {item.user?.email && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {item.user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-blue-50 rounded">
                          <Package className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {item.provider}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.paymentMethod}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.currency}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          item.status
                        )}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1.5 capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <div className="text-sm text-gray-700">
                          {formatDateTime(item.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.paidAt ? (
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <div className="text-sm text-gray-700">
                            {formatDateTime(item.paidAt)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <div className="text-sm text-gray-700">
                          {formatDateTime(item.updatedAt)}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
