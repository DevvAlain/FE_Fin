import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import siteLogo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import ChangePassword from "./ChangePassword";
import authService, { type User as UserType } from "../services/authService";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const navItems = [
    { name: "Tính năng", href: "#features" },
    { name: "AI Insight", href: "#ai-insight" },
    { name: "Bảng giá", href: "#pricing" },
    { name: "Đánh giá", href: "#testimonials" },
  ];

  useEffect(() => {
    const check = async () => {
      if (authService.isAuthenticated()) {
        const cur = await authService.getCurrentUser();
        setUser(cur);
      }
    };
    check();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-3">
            <img
              src={siteLogo}
              alt="FinWise"
              className="h-10 w-10 rounded-md object-cover"
            />
            <span className="text-xl font-bold text-gray-900">FinWise</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((n) => (
              <a
                key={n.name}
                href={n.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                {n.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.fullName}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsChangePasswordOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Đổi mật khẩu</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700">
                  Đăng nhập
                </a>
                <a
                  href="/"
                  className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
                  Tải App
                </a>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}>
            <div className="flex flex-col space-y-4">
              {navItems.map((n) => (
                <a
                  key={n.name}
                  href={n.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}>
                  {n.name}
                </a>
              ))}

              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="px-2 py-1 text-sm text-gray-500">
                      {user.fullName} • {user.email}
                    </div>
                    <button
                      onClick={() => {
                        setIsChangePasswordOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-600 hover:text-gray-900 font-medium text-left flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Đổi mật khẩu</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 font-medium text-left flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 text-left">
                      Đăng nhập
                    </a>
                    <a
                      href="/"
                      className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 text-left">
                      Tải App
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          /* optional */
        }}
      />
    </motion.header>
  );
};

export default Header;
