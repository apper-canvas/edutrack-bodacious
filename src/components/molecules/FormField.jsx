import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  error, 
  helperText, 
  required = false,
  type = "input",
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {type === "input" && (
        <Input error={!!error} {...props} />
      )}
      
      {type === "select" && (
        <Select error={!!error} {...props}>
          {children}
        </Select>
      )}
      
      {type === "textarea" && (
        <textarea
          className={cn(
            "w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white resize-none",
            error 
              ? "border-error focus:border-error focus:ring-error/20"
              : "border-gray-300 focus:border-primary focus:ring-primary/20"
          )}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;