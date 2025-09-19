import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className,
  type = "inline" 
}) => {
  if (type === "page") {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-96 p-8", className)}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {onRetry && (
            <Button onClick={onRetry} className="inline-flex items-center">
              <ApperIcon name="RefreshCw" className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            Error Loading Data
          </h4>
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <ApperIcon name="RefreshCw" className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Error;