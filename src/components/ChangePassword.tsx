import React, { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import authService from "../services/authService";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setStatus("form");
    setMessage("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Trim inputs
    const oldPassTrim = String(formData.oldPassword || "").trim();
    const newPassTrim = String(formData.newPassword || "").trim();
    const confirmTrim = String(formData.confirmPassword || "").trim();

    // Validate passwords
    if (newPassTrim !== confirmTrim) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp");
      setLoading(false);
      return;
    }

    if (newPassTrim.length < 6) {
      setMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    if (oldPassTrim === newPassTrim) {
      setMessage("Mật khẩu mới không được trùng với mật khẩu cũ");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.changePassword(oldPassTrim, newPassTrim);

      if (result.success) {
        setStatus("success");
        setMessage("Đổi mật khẩu thành công!");

        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      } else {
        setStatus("error");
        setMessage(result.message || "Đổi mật khẩu thất bại");
      }
    } catch {
      setStatus("error");
      setMessage("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "form" && (
            <>
              {message && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showOldPassword ? "text" : "password"}
                      required
                      value={formData.oldPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          oldPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </button>
              </form>
            </>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Thành công!
              </h3>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => {
                  setStatus("form");
                  setMessage("");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
