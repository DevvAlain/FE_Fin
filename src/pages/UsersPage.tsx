import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  Download,
  ArrowUpRight,
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import adminService from "../services/adminService";

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: "user" | "admin" | "staff";
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  subscription?: {
    planName: string;
    status: "active" | "expired" | "cancelled";
  };
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { users } = await adminService.listUsers();
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    // Bỏ qua admin users
    if (user.role === "admin") return false;

    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await adminService.lockUser(userId);
      } else {
        await adminService.unlockUser(userId);
      }
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !isActive } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { users } = await adminService.listUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
            <p className="text-indigo-100 text-lg">
              Quản lý tài khoản và quyền truy cập
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-indigo-100">Tổng người dùng</div>
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
            <button
              onClick={() => console.log("Create user")}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Tổng người dùng
            </h3>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            <div className="mt-2 text-xs text-gray-500">Đã đăng ký</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +8%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Đang hoạt động
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter((u) => u.isActive).length}
            </p>
            <div className="mt-2 text-xs text-gray-500">Đang sử dụng</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +15%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Người dùng mới
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {
                users.filter((u) => {
                  const createdDate = new Date(u.createdAt);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return createdDate > thirtyDaysAgo;
                }).length
              }
            </p>
            <div className="mt-2 text-xs text-gray-500">Trong 30 ngày</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-right gap-4">
          {/* Filter Label */}
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Bộ lọc</h3>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Tìm kiếm..."
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[140px]">
            <option value="">Tất cả vai trò</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[160px]">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          {/* Export Button */}
          <button className="flex items-center px-4 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">
            <Download className="h-4 w-4 mr-2" />
            Xuất
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all font-medium ${
              refreshing
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Đang tải..." : "Làm mới"}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Danh sách người dùng
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              Hiển thị {filteredUsers.length} kết quả
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Gói đăng ký
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Đăng nhập cuối
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                        user.role
                      )}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "staff"
                        ? "Staff"
                        : "User"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {user.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Không hoạt động
                        </>
                      )}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.subscription ? (
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.subscription.planName}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            user.subscription.status
                          )}`}>
                          {user.subscription.status === "active"
                            ? "Hoạt động"
                            : user.subscription.status === "expired"
                            ? "Hết hạn"
                            : "Đã hủy"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Chưa đăng ký
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.lastLoginAt
                        ? formatDate(user.lastLoginAt)
                        : "Chưa đăng nhập"}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Tham gia: {formatDate(user.createdAt)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => console.log("Edit user:", user._id)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(user._id, user.isActive)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? "text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50"
                            : "text-green-600 hover:text-green-900 hover:bg-green-50"
                        }`}
                        title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
                        {user.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {users.length === 0
                ? "Chưa có người dùng"
                : "Không tìm thấy kết quả"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {users.length === 0
                ? "Hệ thống chưa có người dùng nào. Người dùng sẽ xuất hiện khi họ đăng ký tài khoản."
                : "Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc."}
            </p>
            <div className="flex items-center justify-center space-x-4">
              {users.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("");
                    setStatusFilter("");
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Xóa bộ lọc
                </button>
              )}
              <button
                onClick={() => console.log("Create user")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                <Plus className="h-5 w-5 mr-2" />
                Thêm người dùng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
