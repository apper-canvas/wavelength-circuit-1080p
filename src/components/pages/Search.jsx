import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import TrackItem from "@/components/molecules/TrackItem";
import AlbumCard from "@/components/molecules/AlbumCard";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import trackService from "@/services/api/trackService";
import albumService from "@/services/api/albumService";
import playlistService from "@/services/api/playlistService";
import artistService from "@/services/api/artistService";
import ApperIcon from "@/components/ApperIcon";

const Search = () => {
  const { playTrack, playerState } = useOutletContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    tracks: [],
    albums: [],
    playlists: [],
    artists: []
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchAll = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ tracks: [], albums: [], playlists: [], artists: [] });
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      
      const [tracks, albums, playlists, artists] = await Promise.all([
        trackService.search(searchQuery),
        albumService.search(searchQuery),
        playlistService.getAll().then(all => 
          all.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ),
        artistService.search(searchQuery)
      ]);

      setResults({ tracks, albums, playlists, artists });
      setHasSearched(true);
    } catch (err) {
      toast.error("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAll(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handlePlayTrack = (track) => {
    playTrack(track, results.tracks);
    toast.success(`Playing "${track.title}"`);
  };

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
        playTrack(playlistWithTracks.trackDetails[0], playlistWithTracks.trackDetails);
        toast.success(`Playing "${playlist.name}"`);
      }
    } catch (err) {
      toast.error("Failed to play playlist");
    }
  };

  const handleToggleLike = async (trackId) => {
    try {
      const updatedTrack = await trackService.toggleLike(trackId);
      setResults(prev => ({
        ...prev,
        tracks: prev.tracks.map(track => 
          track.Id === trackId ? updatedTrack : track
        )
      }));
toast.success((updatedTrack.isLiked_c || updatedTrack.isLiked) ? "Added to Liked Songs" : "Removed from Liked Songs");
    } catch (err) {
      toast.error("Failed to update liked status");
    }
  };

  const handleAddToQueue = (item) => {
    toast.success(`Added to queue`);
  };

  const handleAddToPlaylist = (track) => {
    toast.info("Playlist feature coming soon!");
  };

  const totalResults = results.tracks.length + results.albums.length + results.playlists.length + results.artists.length;

  if (loading) return <Loading />;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-dark via-surface/20 to-dark">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-6">
            Search Music
          </h1>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search songs, artists, albums, playlists..."
            className="max-w-2xl"
          />
        </div>

        {!hasSearched && !query && (
          <Empty
            title="Start searching"
            description="Find your favorite songs, artists, albums, and playlists"
            icon="Search"
          />
        )}

        {hasSearched && totalResults === 0 && (
          <Empty
            title="No results found"
            description={`No results found for "${query}". Try different keywords.`}
            icon="SearchX"
          />
        )}

        {hasSearched && totalResults > 0 && (
          <div className="space-y-12">
            {/* Tracks */}
            {results.tracks.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Music" className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-display font-bold text-white">
                    Songs ({results.tracks.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {results.tracks.slice(0, 10).map((track, index) => (
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
              </section>
            )}

            {/* Albums */}
            {results.albums.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Disc" className="h-6 w-6 text-secondary" />
                  <h2 className="text-2xl font-display font-bold text-white">
                    Albums ({results.albums.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {results.albums.map((album) => (
                    <AlbumCard
                      key={album.Id}
                      album={album}
                      onPlay={handlePlayAlbum}
                      onAddToQueue={handleAddToQueue}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {results.playlists.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="ListMusic" className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-display font-bold text-white">
                    Playlists ({results.playlists.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {results.playlists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.Id}
                      playlist={playlist}
                      onPlay={handlePlayPlaylist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {results.artists.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="User" className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-display font-bold text-white">
                    Artists ({results.artists.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {results.artists.map((artist) => (
                    <div
                      key={artist.Id}
                      className="group bg-gradient-to-br from-surface/80 to-gray-800/60 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 border border-gray-700/50 text-center"
                      onClick={() => toast.info("Artist page coming soon!")}
                    >
                      <div className="aspect-square mb-4 overflow-hidden rounded-full mx-auto max-w-[120px]">
                        <img 
src={artist.image_c?.url || artist.image || "https://images.unsplash.com/photo-1494790108755-2616c04be44e?w=400&h=400&fit=crop&crop=center"} 
                          alt={artist.Name || artist.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="font-display font-semibold text-white text-lg mb-2 truncate group-hover:text-yellow-400 transition-colors duration-300">
                        {artist.Name || artist.name}
                      </h3>
                      <p className="text-gray-400 text-sm">Artist</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;