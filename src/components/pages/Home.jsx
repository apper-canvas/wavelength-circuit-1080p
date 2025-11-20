import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import albumService from "@/services/api/albumService";
import playlistService from "@/services/api/playlistService";
import trackService from "@/services/api/trackService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import AlbumCard from "@/components/molecules/AlbumCard";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const { playTrack } = useOutletContext();
  const [data, setData] = useState({
    featuredAlbums: [],
    recentAlbums: [],
    playlists: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [featuredAlbums, recentAlbums, playlists] = await Promise.all([
        albumService.getFeatured(),
        albumService.getRecent(),
        playlistService.getAll()
      ]);

      setData({
        featuredAlbums,
        recentAlbums,
        playlists: playlists.slice(0, 6)
      });
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePlayAlbum = async (album) => {
    try {
      const albumWithTracks = await albumService.getWithTracks(album.Id);
      if (albumWithTracks.trackDetails?.length > 0) {
        playTrack(albumWithTracks.trackDetails[0], albumWithTracks.trackDetails);
toast.success(`Playing "${album.title_c || album.title}"`);
      }
    } catch (err) {
      toast.error("Failed to play album");
    }
  };

  const handlePlayPlaylist = async (playlist) => {
    try {
      const playlistWithTracks = await playlistService.getWithTracks(playlist.Id);
      if (playlistWithTracks.trackDetails?.length > 0) {
if (playlistWithTracks.trackDetails?.length > 0) {
          playTrack(playlistWithTracks.trackDetails[0], playlistWithTracks.trackDetails);
        }
        toast.success(`Playing "${playlist.name}"`);
      }
    } catch (err) {
      toast.error("Failed to play playlist");
    }
  };

  const handleAddToQueue = (item) => {
    toast.success(`"${item.title || item.name}" added to queue`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6 pb-8">
        {/* Hero Section */}
        <div className="relative mb-12 p-8 rounded-3xl bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl">
                <ApperIcon name="Music" className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  Welcome to Wavelength
                </h1>
                <p className="text-xl text-gray-300 font-body">
                  Discover your next favorite song
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Albums */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-display font-bold text-white">
              Featured Albums
            </h2>
            <p className="text-gray-400">Handpicked for you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data.featuredAlbums.map((album) => (
              <AlbumCard
                key={album.Id}
                album={album}
                onPlay={handlePlayAlbum}
                onAddToQueue={handleAddToQueue}
                size="default"
              />
            ))}
          </div>
        </section>

        {/* Recent Albums */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-display font-bold text-white">
              Recent Releases
            </h2>
            <p className="text-gray-400">Latest music</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.recentAlbums.map((album) => (
              <AlbumCard
                key={album.Id}
                album={album}
                onPlay={handlePlayAlbum}
                onAddToQueue={handleAddToQueue}
                size="default"
              />
            ))}
          </div>
        </section>

        {/* Popular Playlists */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-display font-bold text-white">
              Popular Playlists
            </h2>
            <p className="text-gray-400">Curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data.playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.Id}
                playlist={playlist}
                onPlay={handlePlayPlaylist}
                size="default"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;