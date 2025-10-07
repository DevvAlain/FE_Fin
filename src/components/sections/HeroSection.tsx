import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}>
                <Star className="h-4 w-4 mr-2 fill-current" />
                Được tin dùng bởi 10,000+ người dùng
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Quản lý chi tiêu{" "}
                <span className="text-blue-600">thông minh</span> cùng{" "}
                <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Phân tích, tối ưu, và kiểm soát tài chính cá nhân của bạn với
                FinWise. Trải nghiệm quản lý ví thông minh được hỗ trợ bởi AI
                tiên tiến.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}>
                  Tải App FinWise
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>

                <motion.button
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <Play className="mr-2 h-5 w-5" />
                  Xem demo
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium">✨ Miễn phí 30 ngày</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">🔒 Bảo mật tuyệt đối</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">📱 Đa nền tảng</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-6 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Tổng quan tài chính
                    </h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-blue-100 text-sm">Số dư hiện tại</p>
                      <p className="text-2xl font-bold">₫15.2M</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-blue-100 text-sm">
                        Chi tiêu tháng này
                      </p>
                      <p className="text-2xl font-bold">₫4.8M</p>
                    </div>
                  </div>

                  {/* Chart visualization */}
                  <div className="h-32 bg-white/10 rounded-lg flex items-end justify-between p-3">
                    {[40, 70, 30, 90, 60, 80, 50].map((height, index) => (
                      <motion.div
                        key={index}
                        className="bg-yellow-400 rounded-sm"
                        style={{ width: "8px" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Suggestion Card */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-400 rounded-full p-1">
                      <span className="text-xs">🤖</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Gợi ý từ AI
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Bạn có thể tiết kiệm 12% bằng cách giảm chi tiêu cafe và
                        chuyển sang pha tại nhà.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Mobile App */}
              <motion.div
                className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-4 w-48"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: -3 }}>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white text-center">
                  <p className="text-sm font-medium mb-2">FinWise Mobile</p>
                  <div className="flex justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3 w-3 fill-current text-yellow-300"
                      />
                    ))}
                  </div>
                  <p className="text-xs opacity-90">Quản lý mọi lúc, mọi nơi</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
