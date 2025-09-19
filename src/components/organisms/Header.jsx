import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { cn } from "@/services/mockData/grades.json";
import { cn } from "@/services/mockData/students.json";
import { cn } from "@/services/mockData/classes.json";
import { cn } from "@/services/mockData/attendance.json";

const Header = ({ title, onMenuClick, actions, className }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <header className={cn("sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm lg:px-6", className)}>
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
        
        {/* Title */}
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
        
        {/* User info and logout */}
        {isAuthenticated && user && (
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-500">
                {user.emailAddress}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
      </div>
    </header>
  );
};
