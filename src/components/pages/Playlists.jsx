import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import playlistService from "@/services/api/playlistService";
import ApperIcon from "@/components/ApperIcon";

const Playlists = () => {
  const { playTrack } = useOutletContext();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await playlistService.getAll();
      setPlaylists(data);
    } catch (err) {
      setError(err.message || "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handlePlayPlaylist = async (playlist) => {
    try {
      const playlistWithTracks = await playlistService.getWithTracks(playlist.Id);
      if (playlistWithTracks.trackDetails?.length > 0) {
        playTrack(playlistWithTracks.trackDetails[0], playlistWithTracks.trackDetails);
        toast.success(`Playing "${playlist.name}"`);
      } else {
        toast.info("This playlist is empty");
      }
    } catch (err) {
      toast.error("Failed to play playlist");
    }
  };

  const handleCreatePlaylist = () => {
    navigate("/playlists/create");
  };

  const handleEditPlaylist = (playlist) => {
    toast.info("Edit playlist feature coming soon!");
  };

  const handleDeletePlaylist = async (playlist) => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      try {
        await playlistService.delete(playlist.Id);
        setPlaylists(prev => prev.filter(p => p.Id !== playlist.Id));
        toast.success("Playlist deleted successfully");
      } catch (err) {
        toast.error("Failed to delete playlist");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadPlaylists} />;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Your Playlists
            </h1>
            <p className="text-gray-400 text-lg">
              {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={handleCreatePlaylist}
            icon="Plus"
            className="bg-gradient-to-r from-primary to-accent hover:scale-105 shadow-xl hover:shadow-primary/30"
          >
            Create Playlist
          </Button>
        </div>

        {/* Content */}
        {playlists.length > 0 ? (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Liked Songs Quick Access */}
              <div 
                className="group relative bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-red-500/30"
                onClick={() => navigate("/liked")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl">
                    <ApperIcon name="Heart" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      Liked Songs
                    </h3>
                    <p className="text-red-300">Your favorite tracks</p>
                  </div>
                </div>
              </div>

              {/* Recently Played */}
              <div className="group relative bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 border border-green-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-2xl">
                    <ApperIcon name="Clock" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      Recently Played
                    </h3>
                    <p className="text-green-300">Coming soon</p>
                  </div>
                </div>
              </div>

              {/* Made For You */}
              <div className="group relative bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-2xl">
                    <ApperIcon name="Sparkles" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      Made For You
                    </h3>
                    <p className="text-purple-300">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlists Grid */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <ApperIcon name="ListMusic" className="h-6 w-6 text-accent" />
                Created by you
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.Id}
                    playlist={playlist}
                    onPlay={handlePlayPlaylist}
                    onEdit={handleEditPlaylist}
                    onDelete={handleDeletePlaylist}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <Empty
            title="No playlists yet"
            description="Create your first playlist to organize your favorite tracks"
            action={handleCreatePlaylist}
            actionText="Create Your First Playlist"
            icon="ListMusic"
          />
        )}
      </div>
    </div>
  );
};

export default Playlists;