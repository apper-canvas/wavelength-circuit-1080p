import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Slider from "@/components/atoms/Slider";

const VolumeControl = ({ 
  volume = 0.7, 
  onVolumeChange,
  className 
}) => {
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [showSlider, setShowSlider] = useState(false);

  const getVolumeIcon = () => {
    if (volume === 0) return "VolumeX";
    if (volume < 0.5) return "Volume1";
    return "Volume2";
  };

  const toggleMute = () => {
    if (volume === 0) {
      onVolumeChange?.(previousVolume);
    } else {
      setPreviousVolume(volume);
      onVolumeChange?.(0);
    }
  };

  const handleVolumeChange = (newVolume) => {
    onVolumeChange?.(newVolume);
    if (newVolume > 0) {
      setPreviousVolume(newVolume);
    }
  };

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="text-gray-400 hover:text-white w-8 h-8"
      >
        <ApperIcon name={getVolumeIcon()} className="h-4 w-4" />
      </Button>

      <div className={cn(
        "w-20 transition-all duration-300 overflow-hidden",
        showSlider ? "opacity-100 max-w-20" : "opacity-0 max-w-0"
      )}>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          className="h-2"
        />
      </div>
    </div>
  );
};

export default VolumeControl;