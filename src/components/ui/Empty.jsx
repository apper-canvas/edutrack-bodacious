import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Database",
  action,
  actionLabel = "Add Item",
  className,
  type = "inline"
}) => {
  if (type === "page") {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-96 p-8", className)}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          
          {action && (
            <Button onClick={action} className="inline-flex items-center">
              <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <Card className={cn("p-12", className)}>
      <div className="text-center max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-8 w-8 text-white" />
        </div>
        
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h4>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {action && (
          <Button onClick={action} size="sm">
            <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;