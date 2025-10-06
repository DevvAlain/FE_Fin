import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Users } from "lucide-react";

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      icon: Users,
      price: 0,
      annualPrice: 0,
      description: "Phù hợp cho người mới bắt đầu",
      color: "border-gray-200",
      bgColor: "bg-white",
      buttonColor: "bg-gray-900 hover:bg-gray-800",
      popular: false,
      features: [
        "Kết nối 2 tài khoản ngân hàng",
        "Theo dõi 50 giao dịch/tháng",
        "Báo cáo cơ bản",
        "3 gợi ý AI/tháng",
        "Hỗ trợ email",
        "Lưu trữ dữ liệu 3 tháng",
      ],
      limitations: [
        "Không có dự báo chi tiết",
        "Không có xuất báo cáo",
        "Không có chia sẻ gia đình",
      ],
    },
    {
      name: "Premium",
      icon: Crown,
      price: 99000,
      annualPrice: 990000,
      description: "Tối ưu cho quản lý cá nhân",
      color: "border-blue-500 ring-2 ring-blue-500",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true,
      features: [
        "Kết nối không giới hạn tài khoản",
        "Theo dõi giao dịch không giới hạn",
        "Báo cáo chi tiết & trực quan",
        "Gợi ý AI cá nhân hóa không giới hạn",
        "Dự báo tài chính thông minh",
        "Xuất báo cáo PDF/Excel",
        "Đặt mục tiêu tiết kiệm",
        "Cảnh báo chi tiêu thông minh",
        "Hỗ trợ chat 24/7",
        "Lưu trữ dữ liệu vĩnh viễn",
      ],
      limitations: [],
    },
    {
      name: "Family",
      icon: Zap,
      price: 199000,
      annualPrice: 1990000,
      description: "Dành cho gia đình và nhóm",
      color: "border-purple-500",
      bgColor: "bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false,
      features: [
        "Tất cả tính năng Premium",
        "Quản lý tài chính gia đình",
        "Chia sẻ ngân sách với 5 thành viên",
        "Báo cáo tổng hợp gia đình",
        "Phân quyền truy cập linh hoạt",
        "Mục tiêu tiết kiệm chung",
        "Chat AI cho cả gia đình",
        "Tư vấn đầu tư cá nhân",
        "Hỗ trợ ưu tiên",
        "Backup dữ liệu tự động",
      ],
      limitations: [],
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Chọn gói phù hợp với <span className="text-blue-600">nhu cầu</span>{" "}
            của bạn
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Bắt đầu miễn phí, nâng cấp khi cần thiết. Tất cả gói đều có đầy đủ
            tính năng bảo mật.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span
              className={`font-medium ${
                !isAnnual ? "text-gray-900" : "text-gray-500"
              }`}>
              Hàng tháng
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isAnnual ? "bg-blue-600" : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`font-medium ${
                isAnnual ? "text-gray-900" : "text-gray-500"
              }`}>
              Hàng năm
            </span>
            {isAnnual && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Tiết kiệm 17%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${plan.bgColor} border-2 ${
                plan.color
              } ${
                plan.popular
                  ? "scale-105 shadow-2xl"
                  : "shadow-lg hover:shadow-xl"
              } transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}>
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Phổ biến nhất</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.name === "Free"
                      ? "bg-gray-100"
                      : plan.name === "Premium"
                      ? "bg-blue-100"
                      : "bg-purple-100"
                  }`}>
                  <plan.icon
                    className={`h-8 w-8 ${
                      plan.name === "Free"
                        ? "text-gray-600"
                        : plan.name === "Premium"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }`}
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0
                      ? "Miễn phí"
                      : formatPrice(isAnnual ? plan.annualPrice : plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-lg">
                      /{isAnnual ? "năm" : "tháng"}
                    </span>
                  )}
                </div>

                {isAnnual && plan.price > 0 && (
                  <p className="text-sm text-gray-500">
                    ~
                    {formatPrice(
                      (isAnnual ? plan.annualPrice : plan.price * 12) / 12
                    )}
                    /tháng
                  </p>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}

                {plan.limitations.map((limitation, limitIndex) => (
                  <div
                    key={limitIndex}
                    className="flex items-start space-x-3 opacity-50">
                    <span className="text-gray-400 mt-0.5">✕</span>
                    <span className="text-gray-500 text-sm line-through">
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-colors ${plan.buttonColor}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                {plan.name === "Free" ? "Bắt đầu miễn phí" : "Chọn gói này"}
              </motion.button>

              {plan.name !== "Free" && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Dùng thử miễn phí 30 ngày
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Tôi có thể hủy bất cứ lúc nào không?
              </h4>
              <p className="text-gray-600 text-sm">
                Có, bạn có thể hủy gói Premium hoặc Family bất cứ lúc nào mà
                không mất phí.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Dữ liệu của tôi có an toàn không?
              </h4>
              <p className="text-gray-600 text-sm">
                Tuyệt đối. Chúng tôi sử dụng mã hóa end-to-end và tuân thủ chuẩn
                bảo mật quốc tế.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
