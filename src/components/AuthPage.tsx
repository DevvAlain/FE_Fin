import React from 'react';
import EmailVerification from './EmailVerification';
import ResetPassword from './ResetPassword';

interface AuthPageProps {
  type: 'verify-email' | 'reset-password';
  token: string;
  returnUrl?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ type, token, returnUrl }) => {
  if (type === 'verify-email') {
    return <EmailVerification token={token} returnUrl={returnUrl} />;
  }
  
  if (type === 'reset-password') {
    return <ResetPassword token={token} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Trang không tồn tại
        </h1>
        <p className="text-gray-600 mb-6">
          Liên kết bạn truy cập không hợp lệ.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default AuthPage;