import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PlayerControls from "@/components/molecules/PlayerControls";
import VolumeControl from "@/components/molecules/VolumeControl";
import ProgressBar from "@/components/molecules/ProgressBar";

const NowPlayingBar = ({ 
  playerState,
  onTogglePlay,
  onSkipNext,
  onSkipPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  className,
  formatTime,
  getCurrentTime,
  getDuration
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!playerState.currentTrack) return null;

  const { currentTrack, isPlaying, progress, volume, shuffleOn, repeatMode } = playerState;

  const handleExpandClick = () => {
    navigate("/now-playing");
  };

  const handleTrackClick = () => {
    navigate("/now-playing");
  };

  return (
    <>
      {/* Desktop Player Bar */}
      <div className={cn(
        "hidden lg:flex fixed bottom-0 left-0 right-0 bg-gradient-to-r from-surface to-gray-800 border-t border-gray-700/50 backdrop-blur-sm p-4 z-50",
        className
      )}>
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
          {/* Track Info */}
          <div className="flex items-center gap-4 w-80 min-w-0">
            <img 
              src={currentTrack.albumArt} 
              alt={currentTrack.album}
              className="w-14 h-14 rounded-lg object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleTrackClick}
            />
            <div className="min-w-0 flex-1">
              <h3 
                className="font-medium text-white truncate cursor-pointer hover:text-primary transition-colors duration-200"
                onClick={handleTrackClick}
              >
                {currentTrack.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleLike?.(currentTrack.Id)}
              className="text-gray-400 hover:text-red-400 w-8 h-8 flex-shrink-0"
            >
              <ApperIcon 
                name="Heart" 
                className={cn(
                  "h-4 w-4",
                  currentTrack.isLiked && "fill-current text-red-400"
                )} 
              />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            <PlayerControls
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              onSkipPrevious={onSkipPrevious}
              onSkipNext={onSkipNext}
              shuffleOn={shuffleOn}
              onToggleShuffle={onToggleShuffle}
              repeatMode={repeatMode}
              onToggleRepeat={onToggleRepeat}
              size="sm"
            />
            <div className="w-full">
              <ProgressBar
                progress={progress}
                onSeek={onSeek}
                currentTime={getCurrentTime()}
                duration={getDuration()}
                showTime={false}
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 w-80 justify-end">
            <VolumeControl
              volume={volume}
              onVolumeChange={onVolumeChange}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/queue")}
              className="text-gray-400 hover:text-white w-8 h-8"
            >
              <ApperIcon name="List" className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleExpandClick}
              className="text-gray-400 hover:text-white w-8 h-8"
            >
              <ApperIcon name="Maximize2" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Player Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-surface to-gray-800 border-t border-gray-700/50 backdrop-blur-sm z-50">
        {/* Progress Bar */}
        <div className="px-4 pt-2">
          <ProgressBar
            progress={progress}
            onSeek={onSeek}
            currentTime={getCurrentTime()}
            duration={getDuration()}
            showTime={false}
          />
        </div>

        {/* Player Content */}
        <div className="flex items-center justify-between p-4">
          <div 
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            onClick={handleExpandClick}
          >
            <img 
              src={currentTrack.albumArt} 
              alt={currentTrack.album}
              className="w-12 h-12 rounded-lg object-cover shadow-lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white truncate text-sm">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleLike?.(currentTrack.Id)}
              className="text-gray-400 hover:text-red-400 w-10 h-10"
            >
              <ApperIcon 
                name="Heart" 
                className={cn(
                  "h-5 w-5",
                  currentTrack.isLiked && "fill-current text-red-400"
                )} 
              />
            </Button>

            <Button
              variant="primary"
              size="icon"
              onClick={onTogglePlay}
              className="w-10 h-10 bg-gradient-to-r from-primary to-accent"
            >
              <ApperIcon 
                name={isPlaying ? "Pause" : "Play"} 
                className={cn(
                  "h-5 w-5",
                  !isPlaying && "ml-0.5"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NowPlayingBar;