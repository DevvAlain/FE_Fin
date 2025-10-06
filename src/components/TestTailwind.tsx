import React from "react";

const TestTailwind: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Tailwind CSS Test
        </h1>
        <p className="text-gray-600 mb-6">
          Nếu bạn thấy component này với màu sắc đẹp mắt, Tailwind CSS đã hoạt
          động!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg">
          Test Button
        </button>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="h-12 bg-red-500 rounded-lg"></div>
          <div className="h-12 bg-green-500 rounded-lg"></div>
          <div className="h-12 bg-yellow-500 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
