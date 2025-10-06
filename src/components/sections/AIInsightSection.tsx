import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  TrendingDown,
  Target,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const AIInsightSection: React.FC = () => {
  const [activeChat, setActiveChat] = useState(0);

  const chatExamples = [
    {
      id: 1,
      user: "Tôi chi tiêu quá nhiều cho đồ ăn ngoài tháng này",
      ai: "Tôi thấy bạn đã chi 2.8M cho đồ ăn ngoài (tăng 35% so với tháng trước). Tôi gợi ý: Giảm 50% đơn giao đồ ăn, tự nấu 3 bữa/tuần có thể tiết kiệm 800K/tháng. Bạn có muốn tôi thiết lập nhắc nhở không?",
      type: "expense_analysis",
    },
    {
      id: 2,
      user: "Làm sao để tiết kiệm được 50 triệu trong 2 năm?",
      ai: "Để đạt mục tiêu 50M trong 24 tháng, bạn cần tiết kiệm 2.08M/tháng. Dựa trên thu nhập hiện tại, tôi đề xuất: Cắt giảm 15% chi tiêu giải trí, chuyển 30% tiền mặt sang tài khoản tiết kiệm lãi suất cao. Khả năng thành công: 87%",
      type: "savings_goal",
    },
    {
      id: 3,
      user: "Có khoản đầu tư nào phù hợp với tôi không?",
      ai: "Dựa trên profile rủi ro thấp và số dư dư thừa 5M, tôi gợi ý: 60% trái phiếu chính phủ, 30% quỹ mở cân bằng, 10% vàng. Lợi nhuận dự kiến: 8-10%/năm. Bạn có muốn xem phân tích chi tiết không?",
      type: "investment",
    },
  ];

  const insights = [
    {
      icon: TrendingDown,
      title: "Phân tích chi tiêu thông minh",
      description:
        "AI phát hiện các pattern chi tiêu bất thường và đưa ra cảnh báo sớm",
    },
    {
      icon: Target,
      title: "Tối ưu mục tiêu tiết kiệm",
      description:
        "Điều chỉnh mục tiêu dựa trên khả năng tài chính và thói quen cá nhân",
    },
    {
      icon: Lightbulb,
      title: "Gợi ý cá nhân hóa",
      description:
        "Đề xuất cách tiết kiệm phù hợp với lifestyle và ưu tiên của bạn",
    },
    {
      icon: AlertCircle,
      title: "Cảnh báo thông minh",
      description:
        "Nhận thông báo khi có rủi ro về tài chính hoặc cơ hội tiết kiệm",
    },
  ];

  return (
    <section
      id="ai-insight"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Financial Advisor
            </span>{" "}
            cá nhân
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trải nghiệm trợ lý tài chính AI thông minh nhất, hiểu rõ thói quen
            và đưa ra lời khuyên phù hợp với từng cá nhân
          </p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 lg:mb-0">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {/* Chat Header */}
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    FinWise AI Assistant
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">
                      Đang hoạt động
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Examples Tabs */}
              <div className="flex space-x-2 mb-6">
                {chatExamples.map((chat, index) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeChat === index
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    Ví dụ {index + 1}
                  </button>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 h-80 overflow-y-auto">
                <motion.div
                  className="flex justify-end"
                  key={`user-${activeChat}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                    <p className="text-sm">{chatExamples[activeChat].user}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex justify-start"
                  key={`ai-${activeChat}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}>
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 max-w-sm">
                    <p className="text-sm leading-relaxed">
                      {chatExamples[activeChat].ai}
                    </p>
                    <div className="flex items-center mt-3 space-x-2">
                      <button className="text-blue-600 text-xs font-medium hover:underline">
                        Thiết lập ngay
                      </button>
                      <ArrowRight className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Chat Input */}
              <div className="mt-6 flex space-x-3">
                <input
                  type="text"
                  placeholder="Hỏi AI về tài chính của bạn..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Gửi
                </button>
              </div>
            </div>
          </motion.div>

          {/* AI Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              AI hiểu bạn hơn bạn tưởng
            </h3>

            <div className="space-y-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <insight.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Statistics */}
            <motion.div
              className="mt-8 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                <p className="text-3xl font-bold mb-1">92%</p>
                <p className="text-sm text-green-100">Độ chính xác dự đoán</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
                <p className="text-3xl font-bold mb-1">15%</p>
                <p className="text-sm text-purple-100">Tiết kiệm trung bình</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIInsightSection;
