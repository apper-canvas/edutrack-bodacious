import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error = false,
  multiline = false,
  rows,
  label,
  ...props 
}, ref) => {
  const inputId = React.useId();
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white";
  
  const variants = {
    default: "border-gray-300 focus:border-primary focus:ring-primary/20",
    error: "border-error focus:border-error focus:ring-error/20"
};
  
return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
        id={inputId}
        rows={rows}
        className={cn(baseStyles, error ? variants.error : variants.default, className)}
        ref={ref}
        {...props}
      />
    ) : (
      <input
        id={inputId}
        type={type}
        className={cn(baseStyles, error ? variants.error : variants.default, className)}
        ref={ref}
{...props}
      />
    )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;