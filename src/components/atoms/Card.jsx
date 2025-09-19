import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  hover = false,
  gradient = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300";
  
  const variants = {
    default: "",
    hover: "card-hover cursor-pointer",
    gradient: "bg-gradient-to-br from-white to-gray-50"
  };
  
  const getVariant = () => {
    if (hover) return variants.hover;
    if (gradient) return variants.gradient;
    return variants.default;
  };
  
  return (
    <div
      className={cn(baseStyles, getVariant(), className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;