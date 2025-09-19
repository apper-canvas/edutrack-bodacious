import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const GradeIndicator = ({ grade, maxPoints, className }) => {
  const percentage = maxPoints ? Math.round((grade / maxPoints) * 100) : grade;
  
  const getGradeVariant = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "info"; 
    if (percentage >= 70) return "warning";
    if (percentage >= 60) return "warning";
    return "error";
  };
  
  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Badge variant={getGradeVariant(percentage)}>
        {getLetterGrade(percentage)}
      </Badge>
      <span className="text-sm font-medium text-gray-700">
        {grade}{maxPoints && `/${maxPoints}`} ({percentage}%)
      </span>
    </div>
  );
};

export default GradeIndicator;