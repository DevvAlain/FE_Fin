import React from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Shield, Zap } from "lucide-react";

const DownloadSection: React.FC = () => {
  const APK_DOWNLOAD_LINK =
    "https://drive.google.com/uc?export=download&id=135r8MHvxiPfJS8JRyLonboTSdUyNcPgA";

  const features = [
    {
      icon: Smartphone,
      title: "Sử dụng mọi lúc mọi nơi",
      description: "Quản lý tài chính ngay trên điện thoại",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description: "Dữ liệu được mã hóa end-to-end",
    },
    {
      icon: Zap,
      title: "Nhanh & mượt mà",
      description: "Tối ưu hiệu suất cho Android",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}>
              <Download className="h-4 w-4 mr-2" />
              Tải xuống miễn phí
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Tải ứng dụng <br />
              <span className="text-yellow-300">FinWise Mobile</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Trải nghiệm quản lý tài chính thông minh ngay trên điện thoại
              Android của bạn. Miễn phí, không quảng cáo, không giới hạn tính
              năng.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Button */}
            <motion.a
              href={APK_DOWNLOAD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-yellow-400 text-blue-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}>
              <Download className="mr-3 h-6 w-6" />
              Tải APK cho Android
            </motion.a>

            <p className="text-blue-200 text-sm mt-4">
              📱 Tương thích với Android 6.0 trở lên • 💾 Dung lượng: ~25MB
            </p>
          </motion.div>

          {/* Right Image - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 lg:mt-0 relative">
            {/* Phone Frame */}
            <div className="relative mx-auto max-w-sm">
              <motion.div
                className="bg-white rounded-[3rem] shadow-2xl p-4 transform hover:scale-105 transition-transform duration-500"
                whileHover={{ rotate: -2 }}>
                {/* Phone Screen */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-6 text-white overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                      <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* App Logo */}
                  <div className="text-center mb-8">
                    <div className="inline-block bg-yellow-400 rounded-3xl p-6 mb-4 shadow-xl">
                      <Smartphone className="h-12 w-12 text-blue-900" />
                    </div>
                    <h3 className="text-2xl font-bold">FinWise</h3>
                    <p className="text-blue-100 text-sm">
                      Quản lý tài chính thông minh
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-100 text-xs mb-1">
                            Tổng số dư
                          </p>
                          <p className="text-2xl font-bold">₫ 24.5M</p>
                        </div>
                        <div className="bg-green-400/20 rounded-full px-3 py-1">
                          <p className="text-green-300 text-xs font-medium">
                            +12.5%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-100 text-xs mb-1">
                            Chi tiêu tháng này
                          </p>
                          <p className="text-xl font-bold">₫ 8.2M</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Indicator */}
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center space-x-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-medium text-sm"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}>
                      <Download className="h-4 w-4" />
                      <span>Tải ngay</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-yellow-400 rounded-2xl p-4 shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}>
                <div className="text-center">
                  <p className="text-blue-900 text-xs font-medium">Đánh giá</p>
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-bold text-blue-900">
                      4.8
                    </span>
                    <span className="text-yellow-600 ml-1">⭐</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Bảo mật</p>
                    <p className="font-bold text-green-600">100%</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
