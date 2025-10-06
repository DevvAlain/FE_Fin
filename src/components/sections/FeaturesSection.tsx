import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  PieChart,
  Target,
  Brain,
  TrendingUp,
  Shield,
  Smartphone,
  Users,
} from "lucide-react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Wallet,
      title: "Quản lý ví & giao dịch",
      description:
        "Kết nối đa ngân hàng, theo dõi giao dịch real-time và phân loại tự động các khoản thu chi.",
      color: "bg-blue-100 text-blue-600",
      delay: 0.1,
    },
    {
      icon: PieChart,
      title: "Phân loại chi tiêu & thống kê",
      description:
        "Biểu đồ trực quan, báo cáo chi tiết về thói quen chi tiêu và xu hướng tài chính cá nhân.",
      color: "bg-green-100 text-green-600",
      delay: 0.2,
    },
    {
      icon: Target,
      title: "Ngân sách & mục tiêu tiết kiệm",
      description:
        "Thiết lập mục tiêu tiết kiệm thông minh với lộ trình cụ thể và nhắc nhở tự động.",
      color: "bg-purple-100 text-purple-600",
      delay: 0.3,
    },
    {
      icon: Brain,
      title: "Trợ lý AI tài chính",
      description:
        "AI phân tích hành vi chi tiêu, đưa ra gợi ý cá nhân hóa để tối ưu hóa tài chính.",
      color: "bg-yellow-100 text-yellow-600",
      delay: 0.4,
    },
  ];

  const additionalFeatures = [
    {
      icon: TrendingUp,
      title: "Dự báo tài chính",
      description:
        "Dự đoán xu hướng chi tiêu và tình hình tài chính trong tương lai",
    },
    {
      icon: Shield,
      title: "Bảo mật cao cấp",
      description: "Mã hóa end-to-end, xác thực 2FA và tuân thủ chuẩn PCI DSS",
    },
    {
      icon: Smartphone,
      title: "Đa nền tảng",
      description: "Đồng bộ seamless giữa web, iOS, Android và smartwatch",
    },
    {
      icon: Users,
      title: "Chia sẻ gia đình",
      description: "Quản lý ngân sách gia đình và theo dõi chi tiêu chung",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tính năng <span className="text-blue-600">đột phá</span> cho quản lý
            tài chính
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trải nghiệm hoàn toàn mới trong việc quản lý chi tiêu cá nhân với
            công nghệ AI tiên tiến
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}>
              <div
                className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Và nhiều tính năng khác...
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Highlight */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4">
            Sẵn sàng trải nghiệm tương lai của quản lý tài chính?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người dùng đã thay đổi cách quản lý tài
            chính với FinWise
          </p>
          <motion.button
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}>
            Khám phá ngay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
