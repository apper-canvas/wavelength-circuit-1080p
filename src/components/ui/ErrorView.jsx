import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-surface to-dark flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-error/20 to-accent/20 rounded-full blur-2xl"></div>
          <div className="relative bg-gradient-to-r from-surface to-gray-800 rounded-full p-8 shadow-2xl">
            <ApperIcon 
              name="AlertTriangle" 
              className="h-16 w-16 text-error mx-auto" 
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-display font-bold text-white">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-300 font-body">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;