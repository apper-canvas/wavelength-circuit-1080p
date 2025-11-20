import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  value = "", 
  onChange, 
  onSearch,
  placeholder = "Search songs, artists, albums...",
  className,
  debounceMs = 300
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue !== value) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        onChange?.(localValue);
        onSearch?.(localValue);
        setIsSearching(false);
      }, debounceMs);

      return () => {
        clearTimeout(timer);
        setIsSearching(false);
      };
    }
  }, [localValue, value, onChange, onSearch, debounceMs]);

  const handleInputChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        {isSearching ? (
          <ApperIcon name="Loader2" className="h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
        )}
      </div>
      
      <Input
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pl-12 pr-12 text-base bg-gradient-to-r from-surface/80 to-gray-700/80 backdrop-blur-sm border-gray-600 focus:border-primary focus:shadow-lg focus:shadow-primary/20"
      />
      
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
        >
          <ApperIcon name="X" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;