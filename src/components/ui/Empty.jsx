import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding some content",
  action,
  actionText = "Get Started",
  icon = "Music"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
        <div className="relative bg-gradient-to-r from-surface to-gray-800 rounded-full p-12 shadow-2xl">
          <ApperIcon 
            name={icon} 
            className="h-20 w-20 text-primary mx-auto" 
          />
        </div>
      </div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-display font-bold text-white">
          {title}
        </h3>
        <p className="text-gray-400 font-body text-lg leading-relaxed">
          {description}
        </p>
      </div>
      
      {action && (
        <button
          onClick={action}
          className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl text-white font-semibold text-lg hover:shadow-xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300"
        >
          <ApperIcon name="Plus" className="h-5 w-5" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;