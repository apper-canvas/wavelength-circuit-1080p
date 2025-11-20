import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import TrackItem from "@/components/molecules/TrackItem";
import AlbumCard from "@/components/molecules/AlbumCard";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import trackService from "@/services/api/trackService";
import albumService from "@/services/api/albumService";
import playlistService from "@/services/api/playlistService";
import ApperIcon from "@/components/ApperIcon";

const Library = () => {
  const { playTrack, playerState } = useOutletContext();
  const [activeTab, setActiveTab] = useState("playlists");
  const [data, setData] = useState({
    playlists: [],
    likedTracks: [],
    albums: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = [
    { id: "playlists", label: "Playlists", icon: "ListMusic" },
    { id: "liked", label: "Liked Songs", icon: "Heart" },
    { id: "albums", label: "Albums", icon: "Disc" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [playlists, likedTracks, albums] = await Promise.all([
        playlistService.getAll(),
        trackService.getLikedTracks(),
        albumService.getAll()
      ]);

      setData({
        playlists,
        likedTracks,
        albums: albums.slice(0, 12) // Show subset for demo
      });
    } catch (err) {
      setError(err.message || "Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePlayTrack = (track) => {
    const trackList = activeTab === "liked" ? data.likedTracks : [track];
    playTrack(track, trackList);
    toast.success(`Playing "${track.title}"`);
  };

  const handlePlayPlaylist = async (playlist) => {
    try {
      const playlistWithTracks = await playlistService.getWithTracks(playlist.Id);
      if (playlistWithTracks.trackDetails?.length > 0) {
        playTrack(playlistWithTracks.trackDetails[0], playlistWithTracks.trackDetails);
        toast.success(`Playing "${playlist.name}"`);
      }
    } catch (err) {
      toast.error("Failed to play playlist");
    }
  };

  const handlePlayAlbum = async (album) => {
    try {
      const albumWithTracks = await albumService.getWithTracks(album.Id);
      if (albumWithTracks.trackDetails?.length > 0) {
        playTrack(albumWithTracks.trackDetails[0], albumWithTracks.trackDetails);
        toast.success(`Playing "${album.title}"`);
      }
    } catch (err) {
      toast.error("Failed to play album");
    }
  };

  const handleToggleLike = async (trackId) => {
    try {
      const updatedTrack = await trackService.toggleLike(trackId);
      
      // Update the liked tracks list
      setData(prev => ({
        ...prev,
        likedTracks: updatedTrack.isLiked 
          ? [...prev.likedTracks, updatedTrack]
          : prev.likedTracks.filter(track => track.Id !== trackId)
      }));
      
toast.success((updatedTrack.isLiked_c || updatedTrack.isLiked) ? "Added to Liked Songs" : "Removed from Liked Songs");
    } catch (err) {
      toast.error("Failed to update liked status");
    }
  };

  const handleDeletePlaylist = async (playlist) => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      try {
        await playlistService.delete(playlist.Id);
        setData(prev => ({
          ...prev,
          playlists: prev.playlists.filter(p => p.Id !== playlist.Id)
        }));
        toast.success("Playlist deleted");
      } catch (err) {
        toast.error("Failed to delete playlist");
      }
    }
  };

  const handleEditPlaylist = (playlist) => {
    toast.info("Edit playlist feature coming soon!");
  };

  const handleAddToQueue = (item) => {
    toast.success("Added to queue");
  };

  const handleAddToPlaylist = (track) => {
    toast.info("Add to playlist feature coming soon!");
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  const renderTabContent = () => {
    switch (activeTab) {
      case "playlists":
        return data.playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data.playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.Id}
                playlist={playlist}
                onPlay={handlePlayPlaylist}
                onEdit={handleEditPlaylist}
                onDelete={handleDeletePlaylist}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="No playlists yet"
            description="Create your first playlist to organize your favorite tracks"
            action={() => toast.info("Create playlist feature coming soon!")}
            actionText="Create Playlist"
            icon="ListMusic"
          />
        );

      case "liked":
        return data.likedTracks.length > 0 ? (
          <div className="space-y-2">
            {data.likedTracks.map((track, index) => (
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
        ) : (
          <Empty
            title="No liked songs"
            description="Like songs to see them here. Hit the heart icon on any track!"
            icon="Heart"
          />
        );

      case "albums":
        return data.albums.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data.albums.map((album) => (
              <AlbumCard
                key={album.Id}
                album={album}
                onPlay={handlePlayAlbum}
                onAddToQueue={handleAddToQueue}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="No albums in library"
            description="Albums you save will appear here"
            icon="Disc"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Your Library
          </h1>
          <p className="text-gray-400 text-lg">
            All your music in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gradient-to-r from-surface/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
                  : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Library;