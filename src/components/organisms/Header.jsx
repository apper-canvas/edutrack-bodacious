import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onMenuClick, actions, className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;