import React from "react";

const Loading = ({ type = "contacts" }) => {
  if (type === "contacts") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex space-x-2 mt-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "pipeline") {
    return (
      <div className="flex space-x-6 p-6 overflow-x-auto">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-6 bg-gray-300 rounded mb-4 w-24"></div>
              <div className="space-y-3">
                {Array(3).fill(0).map((_, j) => (
                  <div key={j} className="bg-white rounded-lg shadow-sm border animate-pulse p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-green-100 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
    </div>
  );
};

export default Loading;