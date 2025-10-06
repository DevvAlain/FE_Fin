import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";

const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { name: "Tính năng", href: "#features" },
      { name: "AI Insight", href: "#ai-insight" },
      { name: "Bảng giá", href: "#pricing" },
      { name: "API Developers", href: "#" },
      { name: "Tích hợp ngân hàng", href: "#" },
    ],
    company: [
      { name: "Về chúng tôi", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Tuyển dụng", href: "#" },
      { name: "Tin tức", href: "#" },
      { name: "Đối tác", href: "#" },
    ],
    support: [
      { name: "Trung tâm hỗ trợ", href: "#" },
      { name: "Liên hệ", href: "#" },
      { name: "Hướng dẫn sử dụng", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Community", href: "#" },
    ],
    legal: [
      { name: "Chính sách bảo mật", href: "#" },
      { name: "Điều khoản sử dụng", href: "#" },
      { name: "Chính sách cookie", href: "#" },
      { name: "Bảo mật dữ liệu", href: "#" },
      { name: "Khiếu nại", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <motion.div
          className="py-12 border-b border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Đăng ký nhận tin tức tài chính
              </h3>
              <p className="text-gray-400 max-w-md">
                Nhận weekly insights về xu hướng tài chính và tips quản lý tiền
                bạc thông minh từ chuyên gia FinWise.
              </p>
            </div>

            <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                <motion.button
                  className="px-6 py-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <span className="hidden sm:inline">Đăng ký</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Miễn phí và có thể hủy bất cứ lúc nào
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">FinWise</span>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed">
                Hệ thống quản lý chi tiêu cá nhân thông minh được hỗ trợ bởi AI.
                Giúp bạn kiểm soát tài chính và đạt được mục tiêu tiết kiệm.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>support@finwise.vn</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>1900 9999 (miễn phí)</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>Tầng 10, Toà nhà ABC, Q1, TP.HCM</span>
                </div>
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}>
              <h4 className="text-lg font-semibold mb-6">Sản phẩm</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}>
              <h4 className="text-lg font-semibold mb-6">Công ty</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}>
              <h4 className="text-lg font-semibold mb-6">Hỗ trợ</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}>
              <h4 className="text-lg font-semibold mb-6">Pháp lý</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          className="py-6 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 FinWise. All rights reserved. Made with ❤️ in Vietnam
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Được cấp phép hoạt động bởi Ngân hàng Nhà nước Việt Nam
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-4 lg:mt-0">
              <div className="flex justify-center lg:justify-end space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}>
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
