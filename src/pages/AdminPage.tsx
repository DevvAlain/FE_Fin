import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import authService, { type User as UserType } from "../services/authService";
import Sidebar from "../components/SidebarAdmin";
import DashboardPage from "./DashboardPage";
import UsersPage from "./UsersPage";
import PlansPage from "./PlansPage";
import PaymentsPage from "./PaymentsPage";
import SyncLogsPage from "./SyncLogsPage";
import ReviewsPage from "./ReviewsPage"; // Import the ReviewsPage component

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (authService.isAuthenticated()) {
        try {
          const cur = await authService.getCurrentUser();
          setUser(cur);

          // Kiểm tra token admin trong localStorage
          const token = authService.getAccessToken();
          if (token) {
            try {
              const parts = token.split(".");
              if (parts.length === 3) {
                const payload = JSON.parse(
                  decodeURIComponent(
                    escape(
                      window.atob(
                        parts[1].replace(/-/g, "+").replace(/_/g, "/")
                      )
                    )
                  )
                );

                const role = payload?.role || payload?.userRole;
                const isAdmin =
                  role === "admin" ||
                  role === "Admin" ||
                  payload?.isAdmin === true;

                if (!isAdmin) {
                  console.log("Non-admin user detected, redirecting...");
                  authService.logout();
                  window.location.href = "/login";
                  return;
                }

                console.log("Admin token verified in AdminPage:", {
                  role,
                  payload,
                });
              } else {
                throw new Error("Invalid token format");
              }
            } catch (error) {
              console.error("Token validation error:", error);
              authService.logout();
              window.location.href = "/login";
              return;
            }
          } else {
            window.location.href = "/login";
            return;
          }
        } catch (error) {
          console.error("Failed to load user:", error);
          authService.logout();
          window.location.href = "/login";
          return;
        }
      } else {
        // Nếu chưa đăng nhập, redirect về trang login
        window.location.href = "/login";
        return;
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Truy cập bị từ chối
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn chưa đăng nhập hoặc không có quyền truy cập admin.
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Đăng nhập
            </a>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - luôn hiển thị cho tất cả trang admin */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="sync-logs" element={<SyncLogsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
