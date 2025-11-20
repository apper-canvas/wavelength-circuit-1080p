import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import TrackItem from "@/components/molecules/TrackItem";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Queue = () => {
  const navigate = useNavigate();
  const { playerState } = useOutletContext();
  
  // Mock queue data for demo
  const [queue] = useState([
    {
      Id: 1,
      title: "Midnight Dreams",
      artist: "Luna Rose",
      album: "Cosmic Nights",
      duration: 243,
      albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
      isLiked: true
    },
    {
      Id: 2,
      title: "Electric Pulse",
      artist: "Neon Waves",
      album: "Digital Horizons",
      duration: 198,
      albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop&crop=center",
      isLiked: false
    },
    {
      Id: 3,
      title: "Ocean Waves",
      artist: "Marina Blue",
      album: "Deep Waters",
      duration: 267,
      albumArt: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop&crop=center",
      isLiked: true
    }
  ]);

  const handlePlayTrack = (track) => {
toast.success(`Playing "${track.title_c || track.title}"`);
  };

  const handleToggleLike = (trackId) => {
    toast.success("Updated liked status");
  };

  const handleAddToPlaylist = (track) => {
    toast.info("Add to playlist feature coming soon!");
  };

  const handleRemoveFromQueue = (track) => {
    toast.success(`Removed "${track.title}" from queue`);
  };

  const handleClearQueue = () => {
    if (window.confirm("Are you sure you want to clear the queue?")) {
      toast.success("Queue cleared");
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

const totalDuration = queue.reduce((sum, track) => sum + (track.duration_c || track.duration), 0);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              icon="ArrowLeft"
              className="text-gray-400 hover:text-white lg:hidden"
            >
            </Button>
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                Queue
              </h1>
              <p className="text-gray-400">
                {queue.length} song{queue.length !== 1 ? "s" : ""} • {formatDuration(totalDuration)}
              </p>
            </div>
          </div>

          {queue.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => toast.info("Shuffle queue")}
                icon="Shuffle"
                className="hidden sm:flex"
              >
                Shuffle
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClearQueue}
                icon="Trash2"
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Now Playing */}
        {playerState.currentTrack && (
          <div className="mb-8">
            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
              <ApperIcon name="Play" className="h-5 w-5 text-primary" />
              Now Playing
            </h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-2xl border border-primary/30 p-4">
              <TrackItem
                track={playerState.currentTrack}
                index={0}
                isPlaying={playerState.isPlaying}
                isActive={true}
                onPlay={handlePlayTrack}
                onAddToQueue={() => {}}
                onAddToPlaylist={handleAddToPlaylist}
                onToggleLike={handleToggleLike}
                showIndex={false}
              />
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="bg-gradient-to-r from-surface/30 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          {queue.length > 0 ? (
            <div className="p-6">
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <ApperIcon name="List" className="h-5 w-5 text-accent" />
                Up Next
              </h2>
              <div className="space-y-2">
                {queue.map((track, index) => (
                  <TrackItem
                    key={track.Id}
                    track={track}
                    index={index}
                    isPlaying={false}
                    isActive={false}
                    onPlay={handlePlayTrack}
                    onAddToQueue={() => handleRemoveFromQueue(track)}
                    onAddToPlaylist={handleAddToPlaylist}
                    onToggleLike={handleToggleLike}
                    showIndex={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12">
              <Empty
                title="Queue is empty"
                description="Add songs to your queue to see them here"
                action={() => navigate("/")}
                actionText="Browse Music"
                icon="List"
              />
            </div>
          )}
        </div>

        {/* Queue Actions */}
        {queue.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={() => toast.info("Save as playlist")}
              icon="Save"
              className="flex-1 bg-gradient-to-r from-primary to-accent"
            >
              Save as Playlist
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => toast.info("Share queue")}
              icon="Share"
              className="flex-1"
            >
              Share Queue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;