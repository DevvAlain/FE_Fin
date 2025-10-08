import React, { useState } from "react";
import authService from "../services/authService";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<null | { message: string; type: string }>(
    null
  );

  const showToast = (message: string, type = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });
      if (res.success) {
        const resp = res as unknown as { accessToken?: string };
        const token = resp.accessToken || authService.getAccessToken();
        if (!token) {
          setError("Không nhận được token từ server");
          showToast("Không nhận được token từ server", "error");
          return;
        }

        try {
          const parts = token.split(".");
          const payload = JSON.parse(
            decodeURIComponent(
              escape(
                window.atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
              )
            )
          );
          const role = payload?.role;
          if (role !== "admin") {
            setError("Tài khoản không có quyền admin trên web");
            authService.logout();
            showToast("Tài khoản không có quyền admin trên web", "error");
            return;
          }
        } catch {
          setError("Token không hợp lệ");
          authService.logout();
          return;
        }

        showToast("Đăng nhập thành công", "success");
        setTimeout(() => (window.location.href = "/admin"), 700);
      } else {
        setError(res.message || "Đăng nhập thất bại");
        if (res.message) showToast(res.message, "error");
      }
    } catch {
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập Admin</h1>
          <a href="/" className="text-sm text-gray-500 hover:underline">
            Về trang chủ
          </a>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50">
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <a href="/" className="text-sm text-gray-600 hover:underline">
              Hủy
            </a>
          </div>
        </form>

        {toast && (
          <div
            className={`mt-4 p-3 rounded-md text-white ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
