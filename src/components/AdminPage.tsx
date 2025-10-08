import React, { useEffect, useState } from "react";
import authService, { type User as UserType } from "../services/authService";

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const load = async () => {
      if (authService.isAuthenticated()) {
        const cur = await authService.getCurrentUser();
        setUser(cur);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

          {user ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Xin chào, <span className="font-medium">{user.fullName}</span></p>
              <p className="text-sm text-gray-500">Email: {user.email}</p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="/" className="text-sm text-blue-600 hover:underline">Về trang chủ</a>
                <button onClick={handleLogout} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Bạn chưa đăng nhập hoặc không có quyền truy cập admin.</p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="/login" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Đăng nhập</a>
                <a href="/" className="text-sm text-gray-600 hover:underline">Về trang chủ</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
