import React, { useEffect, useState } from "react";
import adminService from "../services/adminService";
import type { Review, ReviewSummary } from "../services/adminService";
import {
  Trash2,
  Star,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Filter,
  RefreshCw,
  Calendar,
  User,
  Mail,
  DollarSign,
  Package,
  ArrowUpRight,
  BarChart3,
  Sparkles,
} from "lucide-react";

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined
  );
  const [providerFilter, setProviderFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.listReviews({
        page: currentPage,
        limit: 10,
        ...(ratingFilter ? { rating: ratingFilter } : {}),
        ...(providerFilter ? { provider: providerFilter } : {}),
      });
      setReviews(data.items);
      setSummary(data.summary);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, ratingFilter, providerFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await adminService.deleteReview(paymentId);
      loadReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError("Không thể xóa đánh giá");
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
        <button
          onClick={loadReviews}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Đánh giá</h1>
            <p className="text-purple-100 text-lg">
              Theo dõi và phản hồi từ khách hàng
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-purple-100">Tổng đánh giá</div>
              <div className="text-2xl font-bold">
                {summary?.totalReviews || 0}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <RefreshCw
                className={`h-6 w-6 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Average Rating */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Đánh giá TB</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {summary.averageRating.toFixed(1)}
                  </div>
                </div>
              </div>
              {renderStars(Math.round(summary.averageRating))}
            </div>

            {/* Positive Sentiment */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {summary.sentiment.percentages.positive}%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                Tích cực
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {summary.sentiment.counts.positive}
              </div>
            </div>

            {/* Neutral Sentiment */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
                  <Minus className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-gray-600 text-sm font-medium">
                  {summary.sentiment.percentages.neutral}%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                Trung lập
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {summary.sentiment.counts.neutral}
              </div>
            </div>

            {/* Negative Sentiment */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                  <ThumbsDown className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-red-600 text-sm font-medium">
                  {summary.sentiment.percentages.negative}%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                Tiêu cực
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {summary.sentiment.counts.negative}
              </div>
            </div>
          </div>

          {/* Rating Distribution & Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Phân bố đánh giá
                </h3>
              </div>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    summary.ratingDistribution[
                      rating as keyof typeof summary.ratingDistribution
                    ];
                  const percentage =
                    summary.totalReviews > 0
                      ? (count / summary.totalReviews) * 100
                      : 0;
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-20">
                        <span className="text-sm font-medium text-gray-700">
                          {rating}
                        </span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700 w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trend & Provider Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xu hướng & Nhà cung cấp
                </h3>
              </div>

              {/* Trend */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Xu hướng 7 ngày
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">7 ngày qua</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {summary.trend.last7Days.count}
                      </div>
                      <div className="text-sm text-gray-600">
                        ({summary.trend.last7Days.avgRating.toFixed(1)}⭐)
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Tuần trước</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {summary.trend.previous7Days.count}
                      </div>
                      <div className="flex items-center">
                        {summary.trend.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : summary.trend.change < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        ) : null}
                        <span
                          className={`text-sm font-medium ${
                            summary.trend.change > 0
                              ? "text-green-600"
                              : summary.trend.change < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}>
                          {summary.trend.change > 0 ? "+" : ""}
                          {summary.trend.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Breakdown */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Theo nhà cung cấp
                </div>
                {summary.providerBreakdown.map((provider) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {provider.provider}
                        </div>
                        <div className="text-xs text-gray-600">
                          {provider.count} đánh giá
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {provider.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Bộ lọc</h3>
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter || ""}
            onChange={(e) => {
              setRatingFilter(
                e.target.value ? parseInt(e.target.value) : undefined
              );
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
            <option value="">Tất cả đánh giá</option>
            <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
            <option value="4">4 sao ⭐⭐⭐⭐</option>
            <option value="3">3 sao ⭐⭐⭐</option>
            <option value="2">2 sao ⭐⭐</option>
            <option value="1">1 sao ⭐</option>
          </select>

          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => {
              setProviderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
            <option value="">Tất cả nhà cung cấp</option>
            {summary?.providerBreakdown.map((p) => (
              <option key={p.provider} value={p.provider}>
                {p.provider.toUpperCase()} ({p.count})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setRatingFilter(undefined);
              setProviderFilter("");
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Danh sách đánh giá
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              Hiển thị {reviews.length} đánh giá
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không có đánh giá
            </h3>
            <p className="text-gray-500">
              Chưa có đánh giá nào phù hợp với bộ lọc của bạn.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((review) => (
              <div
                key={review.paymentId}
                className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {review.user?.name || "Người dùng ẩn danh"}
                      </div>
                      {review.user?.email && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {review.user.email}
                        </div>
                      )}
                      <div className="flex items-center space-x-3 mt-2">
                        {renderStars(review.review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 flex items-center justify-end mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(review.review.createdAt)}
                    </div>
                    <button
                      onClick={() => handleDelete(review.paymentId)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa đánh giá">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {review.review.content && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      "{review.review.content}"
                    </p>
                  </div>
                )}

                <div className="flex items-center flex-wrap gap-3 text-sm">
                  <div className="flex items-center px-3 py-1.5 bg-blue-50 rounded-lg">
                    <Package className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-blue-700 font-medium capitalize">
                      {review.provider}
                    </span>
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-green-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">
                      {formatAmount(review.amount)}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    ID: {review.transactionId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Trước
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
