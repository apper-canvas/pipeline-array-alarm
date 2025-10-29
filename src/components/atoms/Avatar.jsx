import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ src, alt, name, size = "md", className, ...props }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover bg-gradient-to-br from-navy-100 to-primary-100",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-navy-500 to-primary-600 text-white font-medium flex items-center justify-center",
        sizes[size],
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;