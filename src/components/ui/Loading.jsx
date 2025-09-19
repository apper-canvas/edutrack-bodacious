import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ type = "table", className }) => {
  if (type === "table") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="h-6 bg-gray-200 rounded w-32 animate-shimmer"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-shimmer"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-shimmer"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-xl animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === "detail") {
    return (
      <div className={cn("animate-pulse space-y-6", className)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-shimmer"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-shimmer"></div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-shimmer"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;