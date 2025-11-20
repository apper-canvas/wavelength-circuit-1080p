import React from "react";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import usePlayer from "@/hooks/usePlayer";
import trackService from "@/services/api/trackService";
import MobileNavigation from "@/components/organisms/MobileNavigation";
import NowPlayingBar from "@/components/organisms/NowPlayingBar";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const {
    playerState,
    playTrack,
    togglePlay,
    skipNext,
    skipPrevious,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    formatTime,
    getCurrentTime,
    getDuration
  } = usePlayer();

  const handleToggleLike = async (trackId) => {
try {
      await trackService.toggleLike(trackId);
      // In a real app, you'd update the current track state here
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update liked status");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark via-gray-900 to-dark overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-hidden pb-20 lg:pb-24">
          <Outlet context={{ playerState, playTrack }} />
        </div>
        
        {/* Now Playing Bar */}
        <NowPlayingBar
          playerState={playerState}
          onTogglePlay={togglePlay}
          onSkipNext={skipNext}
          onSkipPrevious={skipPrevious}
          onSeek={seekTo}
          onVolumeChange={setVolume}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onToggleLike={handleToggleLike}
          formatTime={formatTime}
          getCurrentTime={getCurrentTime}
          getDuration={getDuration}
        />
      </div>
    </div>
  );
};

export default Layout;