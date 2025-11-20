import React from 'react';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const LogoutButton = ({ className, ...props }) => {
  const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={logout}
      className={cn(
        "text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-200",
        className
      )}
      {...props}
    >
      <ApperIcon name="LogOut" className="h-4 w-4" />
      <span className="ml-2">Logout</span>
    </Button>
  );
};

export default LogoutButton;