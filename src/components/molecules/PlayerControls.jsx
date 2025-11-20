import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PlayerControls = ({ 
  isPlaying, 
  onTogglePlay,
  onSkipPrevious,
  onSkipNext,
  shuffleOn,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  size = "default",
  className
}) => {
  const sizes = {
    sm: {
      main: "w-8 h-8",
      secondary: "w-6 h-6",
      icon: "h-4 w-4"
    },
    default: {
      main: "w-12 h-12",
      secondary: "w-8 h-8", 
      icon: "h-5 w-5"
    },
    lg: {
      main: "w-16 h-16",
      secondary: "w-10 h-10",
      icon: "h-6 w-6"
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case "one":
        return "Repeat1";
      case "all":
        return "Repeat";
      default:
        return "Repeat";
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Shuffle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleShuffle}
        className={cn(
          "text-gray-400 hover:text-white transition-all duration-200",
          sizes[size].secondary,
          shuffleOn && "text-primary hover:text-primary"
        )}
      >
        <ApperIcon 
          name="Shuffle" 
          className={cn(
            sizes[size].icon,
            shuffleOn && "text-primary"
          )} 
        />
      </Button>

      {/* Previous */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkipPrevious}
        className={cn(
          "text-gray-400 hover:text-white transition-all duration-200 hover:scale-110",
          sizes[size].secondary
        )}
      >
        <ApperIcon name="SkipBack" className={sizes[size].icon} />
      </Button>

      {/* Play/Pause */}
      <Button
        variant="primary"
        size="icon"
        onClick={onTogglePlay}
        className={cn(
          "bg-gradient-to-r from-primary to-accent hover:scale-110 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300",
          sizes[size].main
        )}
      >
        <ApperIcon 
          name={isPlaying ? "Pause" : "Play"} 
          className={cn(
            sizes[size].icon,
            !isPlaying && "ml-0.5"
          )} 
        />
      </Button>

      {/* Next */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkipNext}
        className={cn(
          "text-gray-400 hover:text-white transition-all duration-200 hover:scale-110",
          sizes[size].secondary
        )}
      >
        <ApperIcon name="SkipForward" className={sizes[size].icon} />
      </Button>

      {/* Repeat */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleRepeat}
        className={cn(
          "text-gray-400 hover:text-white transition-all duration-200",
          sizes[size].secondary,
          repeatMode !== "none" && "text-primary hover:text-primary"
        )}
      >
        <ApperIcon 
          name={getRepeatIcon()} 
          className={cn(
            sizes[size].icon,
            repeatMode !== "none" && "text-primary"
          )} 
        />
      </Button>
    </div>
  );
};

export default PlayerControls;