import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import authService from "../services/authService";

interface EmailVerificationProps {
  token?: string;
  returnUrl?: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  token,
  returnUrl,
}) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token xác thực không hợp lệ");
        return;
      }

      try {
        const result = await authService.verifyEmail(
          token,
          returnUrl || undefined
        );

        if (result.success) {
          setStatus("success");
          setMessage(result.message || "Email đã được xác thực thành công!");

          // Redirect after success
          setTimeout(() => {
            if (returnUrl) {
              window.location.href = returnUrl;
            } else {
              window.location.href = "/";
            }
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.message || "Xác thực email thất bại");
        }
      } catch {
        setStatus("error");
        setMessage("Lỗi kết nối đến server");
      }
    };

    verifyEmail();
  }, [token, returnUrl]);

  const handleResendVerification = async () => {
    const email = prompt(
      "Vui lòng nhập email của bạn để gửi lại email xác thực:"
    );

    if (!email) return;

    setResendLoading(true);
    setResendMessage("");

    try {
      const result = await authService.resendVerificationEmail(
        email,
        window.location.origin
      );

      if (result.success) {
        setResendMessage("Email xác thực đã được gửi lại thành công!");
      } else {
        setResendMessage(result.message || "Gửi lại email thất bại");
      }
    } catch {
      setResendMessage("Lỗi kết nối đến server");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đang xác thực email...
            </h1>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Xác thực thành công!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">
              Bạn sẽ được chuyển hướng trong giây lát...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Xác thực thất bại
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>

            {resendMessage && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  resendMessage.includes("thành công")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {resendMessage}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                {resendLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Gửi lại email xác thực
                  </>
                )}
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Về trang chủ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
