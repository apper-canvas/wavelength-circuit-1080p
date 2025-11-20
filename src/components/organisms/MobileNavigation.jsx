import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "Search", icon: "Search", path: "/search" },
    { name: "Library", icon: "Library", path: "/library" },
    { name: "Playlists", icon: "Music", path: "/playlists" }
  ];

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gradient-to-r from-surface to-gray-800 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Music" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Wavelength
          </h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="text-white"
        >
          <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Overlay Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-dark/95 backdrop-blur-md">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="Music" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-display font-bold text-white">
                  Wavelength
                </h1>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-white"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-4">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300",
                        isActivePath(item.path) 
                          ? "bg-gradient-to-r from-primary/30 to-secondary/20 text-white border border-primary/30" 
                          : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/10"
                      )}
                    >
                      <ApperIcon 
                        name={item.icon} 
                        className={cn(
                          "h-6 w-6",
                          isActivePath(item.path) ? "text-primary" : "text-gray-400"
                        )} 
                      />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Quick Actions */}
              <div className="mt-8 space-y-4">
                <NavLink
                  to="/liked"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/10 transition-all duration-300"
                >
                  <ApperIcon name="Heart" className="h-6 w-6 text-red-400" />
                  <span>Liked Songs</span>
                </NavLink>

                <NavLink
                  to="/playlists/create"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/10 transition-all duration-300"
                >
                  <ApperIcon name="Plus" className="h-6 w-6 text-accent" />
                  <span>Create Playlist</span>
                </NavLink>
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-surface/50 to-gray-700/30">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Music Lover</p>
                  <p className="text-sm text-gray-400">Free Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-[80px] left-0 right-0 bg-gradient-to-r from-surface to-gray-800 border-t border-gray-700/50 backdrop-blur-sm z-40">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300",
                isActivePath(item.path) 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "h-5 w-5",
                  isActivePath(item.path) && "text-primary"
                )} 
              />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;