import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-surface to-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gradient-to-r from-surface to-gray-700 rounded-xl mb-4 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-surface to-gray-700 rounded-lg w-1/3 animate-pulse"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-gradient-to-br from-surface to-gray-700 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-surface to-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-surface to-gray-700 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;