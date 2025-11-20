import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  onSeek,
  currentTime = 0,
  duration = 0,
  className,
  showTime = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(null);
  const progressRef = useRef(null);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleMouseDown = (e) => {
    if (!progressRef.current || !onSeek) return;
    
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    
    if (isDragging && onSeek) {
      onSeek(position);
    }
    
    setHoverPosition(position);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !onSeek) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    onSeek(position);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    if (isDragging) {
      setIsDragging(false);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="relative w-full h-2 bg-gray-600 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Track */}
        <div className="absolute inset-0 bg-gray-600 rounded-full" />
        
        {/* Progress Track */}
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        
        {/* Hover Preview */}
        {hoverPosition !== null && !isDragging && (
          <div 
            className="absolute top-0 h-full w-1 bg-white/50 rounded-full transition-opacity duration-150"
            style={{ left: `${hoverPosition}%` }}
          />
        )}
        
        {/* Progress Thumb */}
        <div 
          className={cn(
            "absolute top-1/2 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 shadow-lg",
            "opacity-0 group-hover:opacity-100",
            isDragging && "opacity-100 scale-125"
          )}
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Time Display */}
      {showTime && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;