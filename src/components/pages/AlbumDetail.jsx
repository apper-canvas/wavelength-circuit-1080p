import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import TrackItem from "@/components/molecules/TrackItem";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import albumService from "@/services/api/albumService";
import trackService from "@/services/api/trackService";
import ApperIcon from "@/components/ApperIcon";

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, playerState } = useOutletContext();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlbum = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await albumService.getWithTracks(parseInt(id));
      setAlbum(data);
    } catch (err) {
      setError(err.message || "Failed to load album");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadAlbum();
    }
  }, [id]);

  const handlePlayAlbum = () => {
    if (album?.trackDetails?.length > 0) {
playTrack(album.trackDetails[0], album.trackDetails);
      toast.success(`Playing "${album.title_c || album.title}"`);
    }
  };

  const handlePlayTrack = (track) => {
playTrack(track, album.trackDetails || []);
    toast.success(`Playing "${track.title_c || track.title}"`);
  };

  const handleShufflePlay = () => {
    if (album?.trackDetails?.length > 0) {
      const shuffledTracks = [...album.trackDetails].sort(() => 0.5 - Math.random());
playTrack(shuffledTracks[0], shuffledTracks);
      toast.success(`Shuffling "${album.title_c || album.title}"`);
    }
  };

  const handleToggleLike = async (trackId) => {
    try {
      const updatedTrack = await trackService.toggleLike(trackId);
      setAlbum(prev => ({
        ...prev,
        trackDetails: prev.trackDetails?.map(track => 
          track.Id === trackId ? updatedTrack : track
        ) || []
      }));
toast.success((updatedTrack.isLiked_c || updatedTrack.isLiked) ? "Added to Liked Songs" : "Removed from Liked Songs");
    } catch (err) {
      toast.error("Failed to update liked status");
    }
  };

  const handleAddToQueue = (track) => {
toast.success(`"${track.title_c || track.title}" added to queue`);
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
  if (error) return <ErrorView message={error} onRetry={loadAlbum} />;
  if (!album) return <ErrorView message="Album not found" />;

const totalDuration = album.trackDetails?.reduce((sum, track) => sum + (track.duration_c || track.duration), 0) || 0;
  const trackCount = album.trackDetails?.length || 0;

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

        {/* Album Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <img 
src={album.coverArt_c?.url || album.coverArt || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"} 
              alt={album.title_c || album.title}
              className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
            />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-end">
            <div className="mb-4">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-2">
                Album
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 break-words">
{album.title_c || album.title}
              </h1>
              <p className="text-gray-300 text-xl mb-6 font-medium">
                {album.artist_c || album.artist}
              </p>
              
<div className="flex items-center gap-2 text-gray-400">
                <span>{album.releaseYear_c || album.releaseYear}</span>
                <span>•</span>
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
                onClick={handlePlayAlbum}
                disabled={trackCount === 0}
                icon="Play"
                className="bg-gradient-to-r from-primary to-secondary shadow-xl hover:shadow-primary/30 px-8"
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
                <ApperIcon name="Heart" className="h-6 w-6" />
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
          <div className="p-6">
            <div className="space-y-1">
              {album.trackDetails?.map((track, index) => (
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
                  showAlbum={false}
                />
              )) || []}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;