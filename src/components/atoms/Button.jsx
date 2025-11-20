import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:scale-105",
    secondary: "bg-gradient-to-r from-surface to-gray-700 text-white border border-gray-600 hover:border-primary hover:shadow-lg hover:shadow-primary/20",
    accent: "bg-gradient-to-r from-accent to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-accent/25 hover:scale-105",
    ghost: "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10",
    outline: "border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
    icon: "p-2 rounded-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        loading && "cursor-not-allowed",
        className
      )}
      disabled={loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
      )}
      
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
      
      {children}
      
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;