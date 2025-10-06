import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Marketing Manager",
      company: "Tech Startup",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content:
        "FinWise đã thay đổi hoàn toàn cách tôi quản lý tài chính. AI của họ cực kỳ thông minh, dự đoán chính xác 90% thói quen chi tiêu của tôi. Tôi đã tiết kiệm được 3 triệu trong 2 tháng đầu sử dụng!",
      savings: "3,000,000",
      timeUsed: "6 tháng",
      highlight: "Tiết kiệm 3M trong 2 tháng",
    },
    {
      name: "Trần Quốc Bảo",
      role: "Software Engineer",
      company: "Fintech Company",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content:
        "Là một dev, tôi đánh giá cao UI/UX của FinWise. Giao diện trực quan, tính năng phong phú nhưng không phức tạp. Đặc biệt ấn tượng với tính năng dự báo chi tiêu bằng machine learning.",
      savings: "5,500,000",
      timeUsed: "1 năm",
      highlight: "UI/UX xuất sắc",
    },
    {
      name: "Lê Thị Thu Hà",
      role: "Freelance Designer",
      company: "Independent",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content:
        "Thu nhập freelance không ổn định nhưng FinWise giúp tôi quản lý cash flow hiệu quả. Tính năng Family Plan giúp cả gia đình cùng theo dõi ngân sách. Thật sự đáng đầu tư!",
      savings: "2,800,000",
      timeUsed: "8 tháng",
      highlight: "Quản lý cash flow hiệu quả",
    },
    {
      name: "Phạm Hoàng Nam",
      role: "Business Owner",
      company: "F&B Chain",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content:
        "Điều hành 3 nhà hàng nên việc quản lý tài chính cá nhân thường bị lơ là. FinWise như một CFO cá nhân, nhắc nhở và tư vấn tôi mọi lúc. ROI tuyệt vời!",
      savings: "12,000,000",
      timeUsed: "1.5 năm",
      highlight: "Như một CFO cá nhân",
    },
    {
      name: "Đỗ Thị Mai",
      role: "HR Director",
      company: "Multinational Corp",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content:
        "Premium plan hoàn toàn xứng đáng! Báo cáo chi tiết giúp tôi hiểu rõ pattern chi tiêu của cả gia đình. AI suggestions rất practical và dễ thực hiện.",
      savings: "8,200,000",
      timeUsed: "10 tháng",
      highlight: "Premium plan xứng đáng",
    },
    {
      name: "Võ Minh Khôi",
      role: "Student",
      company: "University",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content:
        "Sinh viên như tôi ngân sách hạn chế nhưng Free plan của FinWise đã đủ để tracking chi tiêu cơ bản. Giao diện đẹp, dễ dùng. Sẽ upgrade lên Premium sau khi ra trường!",
      savings: "800,000",
      timeUsed: "4 tháng",
      highlight: "Free plan tuyệt vời cho sinh viên",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Người dùng tin tưởng" },
    { number: "₫2.1B", label: "Tổng tiền tiết kiệm" },
    { number: "4.9/5", label: "Đánh giá trung bình" },
    { number: "98%", label: "Tỷ lệ hài lòng" },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Hàng nghìn người dùng{" "}
            <span className="text-blue-600">tin tưởng</span> FinWise
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nghe những câu chuyện thành công từ cộng đồng người dùng FinWise
            trên toàn quốc
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}>
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-12 w-12 text-blue-600" />
              </div>

              {/* Highlight Badge */}
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block">
                {testimonial.highlight}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>

              {/* Savings Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700 font-medium">
                    Đã tiết kiệm:
                  </span>
                  <span className="text-green-800 font-bold">
                    ₫
                    {new Intl.NumberFormat("vi-VN").format(
                      parseInt(testimonial.savings)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-green-600 mt-1">
                  <span>Thời gian sử dụng:</span>
                  <span>{testimonial.timeUsed}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  <p className="text-gray-400 text-xs">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Bạn sẽ là câu chuyện thành công tiếp theo?
            </h3>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn người dùng thông minh đã chọn FinWise để
              quản lý tài chính hiệu quả
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                Dùng thử miễn phí ngay
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                Xem thêm đánh giá
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
