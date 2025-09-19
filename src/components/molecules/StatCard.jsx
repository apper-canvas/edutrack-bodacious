import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = "primary",
  className
}) => {
  const iconColors = {
    primary: "text-primary bg-blue-100",
    success: "text-success bg-green-100", 
    warning: "text-warning bg-yellow-100",
    error: "text-error bg-red-100",
    info: "text-info bg-blue-100"
  };
  
  return (
    <Card className={cn("p-6", className)} gradient>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "h-4 w-4 mr-1",
                  trend === "up" ? "text-success" : "text-error"
                )} 
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-success" : "text-error"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className={cn("p-3 rounded-xl", iconColors[color])}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;