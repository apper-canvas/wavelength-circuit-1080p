import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import trackService from "@/services/api/trackService";
import ApperIcon from "@/components/ApperIcon";
import TrackItem from "@/components/molecules/TrackItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";

const LikedSongs = () => {
  const navigate = useNavigate();
  const { playTrack, playerState } = useOutletContext();
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLikedTracks = async () => {
    try {
      setLoading(true);
      setError("");
      const tracks = await trackService.getLikedTracks();
      setLikedTracks(tracks);
    } catch (err) {
      setError(err.message || "Failed to load liked songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLikedTracks();
  }, []);

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
      toast.success("Playing liked songs");
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track, likedTracks);
    toast.success(`Playing "${track.title}"`);
  };

  const handleShufflePlay = () => {
    if (likedTracks.length > 0) {
      const shuffledTracks = [...likedTracks].sort(() => 0.5 - Math.random());
      playTrack(shuffledTracks[0], shuffledTracks);
      toast.success("Shuffling liked songs");
    }
  };

const handleToggleLike = async (trackId) => {
    try {
      const updatedTrack = await trackService.toggleLike(trackId);
      
      if (!updatedTrack.isLiked) {
        // Remove from liked tracks
        setLikedTracks(prev => prev.filter(track => track.Id !== trackId));
        toast.success("Removed from Liked Songs");
      } else {
        // Update the track in current list
        setLikedTracks(prev => prev.map(track => 
          track.Id === trackId ? updatedTrack : track
        ));
        toast.success("Added to Liked Songs");
      }
    } catch (err) {
      toast.error("Failed to update liked status");
    }
  };

  const handleAddToQueue = (track) => {
    toast.success(`"${track.title}" added to queue`);
  };

  const handleAddToPlaylist = (track) => {
    toast.info("Add to playlist feature coming soon!");
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadLikedTracks} />;

const totalDuration = likedTracks.reduce((sum, track) => sum + (track.duration_c || track.duration), 0);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
            className="text-gray-400 hover:text-white"
          >
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <ApperIcon name="Heart" className="h-24 w-24 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-end">
            <div className="mb-4">
              <p className="text-sm text-red-400 uppercase tracking-wider font-medium mb-2">
                Playlist
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                Liked Songs
              </h1>
              <p className="text-gray-300 text-lg mb-4">
                Songs you've liked
              </p>
              
              <div className="flex items-center gap-2 text-gray-400">
                <span className="font-medium">{likedTracks.length} song{likedTracks.length !== 1 ? "s" : ""}</span>
                {totalDuration > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatDuration(totalDuration)}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlayAll}
                disabled={likedTracks.length === 0}
                icon="Play"
                className="bg-gradient-to-r from-red-500 to-pink-600 shadow-xl hover:shadow-red-500/30 px-8"
              >
                Play
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleShufflePlay}
                disabled={likedTracks.length === 0}
                icon="Shuffle"
                className="px-8"
              >
                Shuffle
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white w-12 h-12"
              >
                <ApperIcon name="Download" className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white w-12 h-12"
              >
                <ApperIcon name="MoreHorizontal" className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-gradient-to-r from-surface/30 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          {likedTracks.length > 0 ? (
            <div className="p-6">
              <div className="space-y-1">
                {likedTracks.map((track, index) => (
                  <TrackItem
                    key={track.Id}
                    track={track}
                    index={index}
                    isPlaying={playerState.isPlaying}
                    isActive={playerState.currentTrack?.Id === track.Id}
                    onPlay={handlePlayTrack}
                    onAddToQueue={handleAddToQueue}
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
                title="No liked songs yet"
                description="Like songs to see them here. Hit the heart icon on any track!"
                icon="Heart"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;