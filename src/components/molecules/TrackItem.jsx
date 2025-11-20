import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const TrackItem = ({ 
  track, 
  index,
  isPlaying = false,
  isActive = false,
  onPlay,
  onAddToQueue,
  onAddToPlaylist,
  onToggleLike,
  showIndex = true,
  showArtist = true,
  showAlbum = true,
  showDuration = true,
  className
}) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className={cn(
        "group flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-surface/50 hover:to-gray-700/30 transition-all duration-300 cursor-pointer",
        isActive && "bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/30",
        className
      )}
      onClick={() => onPlay?.(track)}
    >
      {/* Index/Play Button */}
      <div className="w-8 flex-shrink-0 text-center">
        {showIndex && (
          <>
            <span className={cn(
              "text-gray-400 text-sm group-hover:hidden",
              isActive && "text-primary"
            )}>
              {index + 1}
            </span>
            <div className="hidden group-hover:block">
              {isPlaying && isActive ? (
                <ApperIcon name="Pause" className="h-4 w-4 text-primary" />
              ) : (
                <ApperIcon name="Play" className="h-4 w-4 text-white" />
              )}
            </div>
          </>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
{(track.albumArt_c || track.albumArt) && (
            <img 
              src={track.albumArt_c?.url || track.albumArt || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"} 
              alt={track.album_c || track.album}
              className="w-10 h-10 rounded object-cover"
            />
          )}
<div className="min-w-0 flex-1">
            <h3 className={cn(
              "font-medium text-white truncate",
              isActive && "text-primary"
            )}>
              {track.title_c || track.title}
            </h3>
            {showArtist && (
              <div className="text-gray-400 text-sm truncate">
                {track.artist_c || track.artist}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="hidden md:block w-48 flex-shrink-0">
          <p className="text-sm text-gray-400 truncate hover:text-gray-300 transition-colors">
{track.album_c || track.album}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike?.(track.Id);
          }}
          className="text-gray-400 hover:text-red-400"
        >
          <ApperIcon 
name={(track.isLiked_c || track.isLiked) ? "Heart" : "Heart"} 
            className={cn("h-4 w-4", (track.isLiked_c || track.isLiked) && "fill-current text-red-400")}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onAddToQueue?.(track);
          }}
          className="text-gray-400 hover:text-primary"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist?.(track);
          }}
          className="text-gray-400 hover:text-accent"
        >
          <ApperIcon name="ListPlus" className="h-4 w-4" />
        </Button>
      </div>

      {/* Duration */}
      {showDuration && (
        <div className="w-16 text-right flex-shrink-0">
          <span className="text-sm text-gray-400">
{formatDuration(track.duration_c || track.duration)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TrackItem;