import React, { useEffect, useState } from "react";
import adminService from "../services/adminService";
import type { Review } from "../services/adminService";
import { Trash2, Star } from "lucide-react";

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.listReviews();
      setReviews(data.items);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminService.deleteReview(paymentId);
      loadReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError("Failed to delete review");
    }
  };

  const formatAmount = (amount: { $numberDecimal: string } | number) => {
    if (typeof amount === "number") {
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
    return parseFloat(amount.$numberDecimal).toLocaleString("vi-VN", {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reviews Dashboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">User</th>
            <th className="border border-gray-300 px-4 py-2">Provider</th>
            <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Currency</th>
            <th className="border border-gray-300 px-4 py-2">Paid At</th>
            <th className="border border-gray-300 px-4 py-2">Review</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.paymentId}>
              <td className="border border-gray-300 px-4 py-2">
                {review.user}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {review.provider}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {review.transactionId}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatAmount(review.amount)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {review.currency}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(review.paidAt)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex items-center">
                  <Star className="text-yellow-500 mr-2" />
                  {review.review.rating} - {review.review.comment}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(review.paymentId)}>
                  <Trash2 className="inline-block mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsPage;
