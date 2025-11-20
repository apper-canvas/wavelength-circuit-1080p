import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PlaylistCard = ({ 
  playlist, 
  onPlay,
  onEdit,
  onDelete,
  className,
  size = "default"
}) => {
  const navigate = useNavigate();

  const sizes = {
    sm: "w-full max-w-[160px]",
    default: "w-full max-w-[200px]",
    lg: "w-full max-w-[240px]"
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleCardClick = () => {
    navigate(`/playlist/${playlist.Id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay?.(playlist);
  };

  return (
    <div 
      className={cn(
        "group relative bg-gradient-to-br from-surface/80 to-gray-800/60 backdrop-blur-sm rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 border border-gray-700/50",
        sizes[size],
        className
      )}
      onClick={handleCardClick}
    >
      {/* Playlist Cover */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
        <img 
src={playlist.coverImage_c?.url || playlist.coverImage || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"} 
          alt={playlist.Name || playlist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            variant="accent"
            size="icon"
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full shadow-2xl hover:scale-110"
          >
            <ApperIcon name="Play" className="h-6 w-6 ml-1" />
          </Button>
        </div>

        {/* Track Count Badge */}
        <div className="absolute top-2 left-2 bg-dark/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs text-white font-medium">
{playlist.trackIds_c || playlist.tracks?.length || 0} tracks
          </span>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-white text-lg leading-tight truncate group-hover:text-accent transition-colors duration-300">
{playlist.Name || playlist.name}
        </h3>
{(playlist.description_c || playlist.description) && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-tight">
            {playlist.description_c || playlist.description}
          </p>
        )}
{(playlist.duration_c || playlist.duration) > 0 && (
          <p className="text-gray-500 text-xs">
            {formatDuration(playlist.duration_c || playlist.duration)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(playlist);
              }}
              className="text-white hover:text-accent bg-dark/80 backdrop-blur-sm hover:bg-accent/20 w-8 h-8"
            >
              <ApperIcon name="Edit" className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(playlist);
              }}
              className="text-white hover:text-error bg-dark/80 backdrop-blur-sm hover:bg-error/20 w-8 h-8"
            >
              <ApperIcon name="Trash2" className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;