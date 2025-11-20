import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import TrackItem from "@/components/molecules/TrackItem";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import playlistService from "@/services/api/playlistService";
import trackService from "@/services/api/trackService";
import ApperIcon from "@/components/ApperIcon";

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, playerState } = useOutletContext();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await playlistService.getWithTracks(parseInt(id));
      setPlaylist(data);
    } catch (err) {
      setError(err.message || "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id]);

  const handlePlayPlaylist = () => {
    if (playlist?.trackDetails?.length > 0) {
      playTrack(playlist.trackDetails[0], playlist.trackDetails);
      toast.success(`Playing "${playlist.name}"`);
    } else {
      toast.info("This playlist is empty");
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track, playlist.trackDetails || []);
    toast.success(`Playing "${track.title}"`);
  };

  const handleShufflePlay = () => {
    if (playlist?.trackDetails?.length > 0) {
      const shuffledTracks = [...playlist.trackDetails].sort(() => 0.5 - Math.random());
      playTrack(shuffledTracks[0], shuffledTracks);
      toast.success(`Shuffling "${playlist.name}"`);
    } else {
      toast.info("This playlist is empty");
    }
  };

  const handleToggleLike = async (trackId) => {
    try {
      const updatedTrack = await trackService.toggleLike(trackId);
      setPlaylist(prev => ({
        ...prev,
        trackDetails: prev.trackDetails?.map(track => 
          track.Id === trackId ? updatedTrack : track
        ) || []
      }));
      toast.success(updatedTrack.isLiked ? "Added to Liked Songs" : "Removed from Liked Songs");
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
  if (error) return <ErrorView message={error} onRetry={loadPlaylist} />;
  if (!playlist) return <ErrorView message="Playlist not found" />;

  const totalDuration = playlist.trackDetails?.reduce((sum, track) => sum + track.duration, 0) || 0;
  const trackCount = playlist.trackDetails?.length || 0;

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

        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <img 
              src={playlist.coverImage} 
              alt={playlist.name}
              className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
            />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-end">
            <div className="mb-4">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-2">
                Playlist
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 break-words">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  {playlist.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-gray-400">
                <span className="font-medium">{trackCount} song{trackCount !== 1 ? "s" : ""}</span>
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
                onClick={handlePlayPlaylist}
                disabled={trackCount === 0}
                icon="Play"
                className="bg-gradient-to-r from-primary to-accent shadow-xl hover:shadow-primary/30 px-8"
              >
                Play
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleShufflePlay}
                disabled={trackCount === 0}
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
                <ApperIcon name="MoreHorizontal" className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-gradient-to-r from-surface/30 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          {trackCount > 0 ? (
            <div className="p-6">
              <div className="space-y-1">
                {playlist.trackDetails.map((track, index) => (
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
                title="This playlist is empty"
                description="Add some tracks to get started"
                icon="ListMusic"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;