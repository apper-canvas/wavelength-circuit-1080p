import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const AlbumCard = ({ 
  album, 
  onPlay,
  onAddToQueue,
  className,
  size = "default"
}) => {
  const navigate = useNavigate();

  const sizes = {
    sm: "w-full max-w-[160px]",
    default: "w-full max-w-[200px]",
    lg: "w-full max-w-[240px]"
  };

  const handleCardClick = () => {
    navigate(`/album/${album.Id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay?.(album);
  };

  return (
    <div 
      className={cn(
        "group relative bg-gradient-to-br from-surface/80 to-gray-800/60 backdrop-blur-sm rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 border border-gray-700/50",
        sizes[size],
        className
      )}
      onClick={handleCardClick}
    >
      {/* Album Art */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
        <img 
          src={album.coverArt} 
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            variant="primary"
            size="icon"
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full shadow-2xl hover:scale-110 bg-gradient-to-r from-primary to-accent"
          >
            <ApperIcon name="Play" className="h-6 w-6 ml-1" />
          </Button>
        </div>
      </div>

      {/* Album Info */}
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-white text-lg leading-tight truncate group-hover:text-primary transition-colors duration-300">
          {album.title}
        </h3>
        <p className="text-gray-400 text-sm truncate hover:text-gray-300 transition-colors duration-200">
          {album.artist}
        </p>
        {album.releaseYear && (
          <p className="text-gray-500 text-xs">
            {album.releaseYear}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onAddToQueue?.(album);
          }}
          className="text-white hover:text-primary bg-dark/80 backdrop-blur-sm hover:bg-primary/20"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AlbumCard;