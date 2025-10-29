import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", size = "md", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-navy-100 to-primary-100 text-navy-800",
    success: "bg-gradient-to-r from-success-100 to-emerald-100 text-success-800",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800",
    danger: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800",
    info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;