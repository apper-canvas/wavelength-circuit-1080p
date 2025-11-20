import React from 'react'
import { useAuth } from '@/layouts/Root'
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "Search", icon: "Search", path: "/search" },
    { name: "Library", icon: "Library", path: "/library" },
    { name: "Liked Songs", icon: "Heart", path: "/liked" }
  ];

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      "hidden lg:flex flex-col w-60 bg-gradient-to-b from-surface to-gray-800 border-r border-gray-700/50 backdrop-blur-sm h-screen",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-700/50">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
          <ApperIcon name="Music" className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Wavelength
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/10 transition-all duration-300 group",
                  isActivePath(item.path) && "bg-gradient-to-r from-primary/30 to-secondary/20 text-white border-l-4 border-primary shadow-lg shadow-primary/20"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActivePath(item.path) ? "text-primary" : "text-gray-400 group-hover:text-white"
                  )} 
                />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Playlists Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Playlists
            </h3>
            <NavLink
              to="/playlists"
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
            </NavLink>
          </div>
          
          <div className="space-y-1">
            <NavLink
              to="/playlists"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-surface/50 hover:to-gray-700/30 transition-all duration-200"
            >
              <ApperIcon name="Music" className="h-4 w-4" />
              <span className="text-sm">Your Playlists</span>
            </NavLink>
            
            <NavLink
              to="/playlists/create"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-surface/50 hover:to-gray-700/30 transition-all duration-200"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span className="text-sm">Create Playlist</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-surface/50 to-gray-700/30">
          <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Music Lover</p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;