import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  CreditCard,
  Calendar,
  Users,
  Target,
  PiggyBank,
  Zap,
  Package,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  DollarSign,
  Activity
} from 'lucide-react';
import adminService, { type SubscriptionPlan } from '../services/adminService';

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    planName: '',
    planType: 'basic',
    price: '',
    currency: 'VND',
    billingPeriod: 'monthly',
    features: [''],
    maxWallets: 1,
    maxMonthlyTransactions: 100,
    aiRecommendationsLimit: 10,
    maxBudgets: 5,
    maxSavingGoals: 3,
    isActive: true
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const planData = {
        ...formData,
        price: formData.price,
        features: formData.features.filter(f => f.trim() !== '')
      };
      await adminService.createPlan(planData as Partial<SubscriptionPlan>);
      setShowCreateForm(false);
      resetForm();
      loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plan');
    }
  };

  const handleUpdate = async () => {
    if (!editingPlan) return;
    try {
      const planData = {
        ...formData,
        price: formData.price,
        features: formData.features.filter(f => f.trim() !== '')
      };
      await adminService.updatePlan(editingPlan._id, planData as Partial<SubscriptionPlan>);
      setEditingPlan(null);
      resetForm();
      loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update plan');
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói này?')) return;
    try {
      await adminService.deletePlan(planId);
      loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete plan');
    }
  };

  const resetForm = () => {
    setFormData({
      planName: '',
      planType: 'basic',
      price: '',
      currency: 'VND',
      billingPeriod: 'monthly',
      features: [''],
      maxWallets: 1,
      maxMonthlyTransactions: 100,
      aiRecommendationsLimit: 10,
      maxBudgets: 5,
      maxSavingGoals: 3,
      isActive: true
    });
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      planName: plan.planName,
      planType: plan.planType,
      price: plan.price,
      currency: plan.currency,
      billingPeriod: plan.billingPeriod,
      features: plan.features.length > 0 ? plan.features : [''],
      maxWallets: plan.maxWallets,
      maxMonthlyTransactions: plan.maxMonthlyTransactions,
      aiRecommendationsLimit: plan.aiRecommendationsLimit,
      maxBudgets: plan.maxBudgets,
      maxSavingGoals: plan.maxSavingGoals,
      isActive: plan.isActive
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(amount));
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <AlertCircle className="h-6 w-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý gói đăng ký</h1>
            <p className="text-purple-100 text-lg">Tạo và quản lý các gói dịch vụ</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-purple-100">Tổng gói</div>
              <div className="text-2xl font-bold">{plans.length}</div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
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
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +2
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tổng gói</h3>
            <p className="text-3xl font-bold text-gray-900">{plans.length}</p>
            <div className="mt-2 text-xs text-gray-500">Đang quản lý</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +1
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Đang hoạt động</h3>
            <p className="text-3xl font-bold text-gray-900">{plans.filter(p => p.isActive).length}</p>
            <div className="mt-2 text-xs text-gray-500">Có thể đăng ký</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <Activity className="h-4 w-4 mr-1" />
                VND
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Giá trung bình</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                plans.length > 0 
                  ? (plans.reduce((sum, plan) => sum + parseInt(plan.price), 0) / plans.length).toString()
                  : '0'
              )}
            </p>
            <div className="mt-2 text-xs text-gray-500">Mỗi tháng</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                Premium
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Gói phổ biến</h3>
            <p className="text-3xl font-bold text-gray-900">
              {plans.filter(p => p.planType === 'premium').length}
            </p>
            <div className="mt-2 text-xs text-gray-500">Premium plans</div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
          <div key={plan._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    plan.planType === 'basic' ? 'bg-blue-100' :
                    plan.planType === 'premium' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <Package className={`h-6 w-6 ${
                      plan.planType === 'basic' ? 'text-blue-600' :
                      plan.planType === 'premium' ? 'text-purple-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.planName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{plan.planType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {plan.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Tạm dừng
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(plan.price)}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {plan.billingPeriod === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1 bg-blue-100 rounded mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Tối đa <span className="font-semibold">{plan.maxWallets}</span> ví</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1 bg-green-100 rounded mr-3">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <span><span className="font-semibold">{formatNumber(plan.maxMonthlyTransactions)}</span> giao dịch/tháng</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1 bg-purple-100 rounded mr-3">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <span><span className="font-semibold">{plan.maxBudgets}</span> ngân sách</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1 bg-yellow-100 rounded mr-3">
                    <PiggyBank className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span><span className="font-semibold">{plan.maxSavingGoals}</span> mục tiêu tiết kiệm</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1 bg-pink-100 rounded mr-3">
                    <Zap className="h-4 w-4 text-pink-600" />
                  </div>
                  <span><span className="font-semibold">{plan.aiRecommendationsLimit}</span> gợi ý AI</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Tính năng nổi bật:</h4>
                <ul className="space-y-2">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{plan.features.length - 3} tính năng khác...
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => startEdit(plan)}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có gói đăng ký</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Bạn chưa tạo gói đăng ký nào. Hãy tạo gói đầu tiên để bắt đầu quản lý dịch vụ.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tạo gói đầu tiên
            </button>
          </div>
        </div>
      )}

      {/* Form tạo/sửa gói */}
      {(showCreateForm || editingPlan) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPlan ? 'Sửa gói đăng ký' : 'Tạo gói đăng ký mới'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên gói
                    </label>
                    <input
                      type="text"
                      value={formData.planName}
                      onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ví dụ: Premium Plus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại gói
                    </label>
                    <select
                      value={formData.planType}
                      onChange={(e) => setFormData(prev => ({ ...prev, planType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="basic">Cơ bản</option>
                      <option value="premium">Cao cấp</option>
                      <option value="enterprise">Doanh nghiệp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VND)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="199000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chu kỳ thanh toán
                    </label>
                    <select
                      value={formData.billingPeriod}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingPeriod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="monthly">Hàng tháng</option>
                      <option value="yearly">Hàng năm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tính năng
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tính năng"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Thêm tính năng
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số ví tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.maxWallets}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxWallets: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giao dịch/tháng
                    </label>
                    <input
                      type="number"
                      value={formData.maxMonthlyTransactions}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxMonthlyTransactions: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngân sách tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.maxBudgets}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxBudgets: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mục tiêu tiết kiệm
                    </label>
                    <input
                      type="number"
                      value={formData.maxSavingGoals}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxSavingGoals: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Gói đang hoạt động
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={editingPlan ? handleUpdate : handleCreate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPlan ? 'Cập nhật' : 'Tạo gói'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansPage;
