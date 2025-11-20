import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import PlayerControls from "@/components/molecules/PlayerControls";
import VolumeControl from "@/components/molecules/VolumeControl";
import ProgressBar from "@/components/molecules/ProgressBar";
import ApperIcon from "@/components/ApperIcon";

const NowPlaying = () => {
  const navigate = useNavigate();
  const { playerState } = useOutletContext();

  // This would come from the player context in a real app
  const mockPlayerActions = {
    onTogglePlay: () => toast.info("Toggle play"),
    onSkipNext: () => toast.info("Skip next"),
    onSkipPrevious: () => toast.info("Skip previous"),
    onSeek: (progress) => toast.info(`Seek to ${progress}%`),
    onVolumeChange: (volume) => toast.info(`Volume: ${Math.round(volume * 100)}%`),
    onToggleShuffle: () => toast.info("Toggle shuffle"),
    onToggleRepeat: () => toast.info("Toggle repeat"),
    getCurrentTime: () => 45,
    getDuration: () => 180,
    formatTime: (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  const handleToggleLike = () => {
    toast.info("Toggle like");
  };

  const handleShowQueue = () => {
    navigate("/queue");
  };

  const handleShowLyrics = () => {
    toast.info("Lyrics feature coming soon!");
  };

  if (!playerState.currentTrack) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-dark via-surface/20 to-dark">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <ApperIcon name="Music" className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            No music playing
          </h2>
          <p className="text-gray-400 mb-6">
            Start playing music to see it here
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            icon="Home"
          >
            Browse Music
          </Button>
        </div>
      </div>
    );
  }

  const { currentTrack, isPlaying, progress, volume, shuffleOn, repeatMode } = playerState;

  return (
    <div className="h-full bg-gradient-to-br from-dark via-surface/20 to-dark overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          <ApperIcon name="ChevronDown" className="h-6 w-6" />
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">PLAYING FROM PLAYLIST</p>
          <p className="text-white font-medium">Liked Songs</p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <ApperIcon name="MoreVertical" className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
          {/* Album Art */}
          <div className="w-full max-w-md lg:max-w-lg mb-8">
            <div className="relative aspect-square mb-6">
              <img 
                src={currentTrack.albumArt} 
                alt={currentTrack.album}
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/20 via-transparent to-transparent rounded-3xl" />
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-8 w-full max-w-md">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3 truncate">
              {currentTrack.title}
            </h1>
            <p className="text-xl text-gray-300 mb-2 truncate">
              {currentTrack.artist}
            </p>
            <p className="text-gray-400 truncate">
              {currentTrack.album}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-8">
            <ProgressBar
              progress={progress}
              onSeek={mockPlayerActions.onSeek}
              currentTime={mockPlayerActions.getCurrentTime()}
              duration={mockPlayerActions.getDuration()}
              showTime={true}
            />
          </div>

          {/* Player Controls */}
          <div className="mb-8">
            <PlayerControls
              isPlaying={isPlaying}
              onTogglePlay={mockPlayerActions.onTogglePlay}
              onSkipPrevious={mockPlayerActions.onSkipPrevious}
              onSkipNext={mockPlayerActions.onSkipNext}
              shuffleOn={shuffleOn}
              onToggleShuffle={mockPlayerActions.onToggleShuffle}
              repeatMode={repeatMode}
              onToggleRepeat={mockPlayerActions.onToggleRepeat}
              size="lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleLike}
              className="text-gray-400 hover:text-red-400 w-10 h-10"
            >
              <ApperIcon 
                name="Heart" 
                className={`h-6 w-6 ${currentTrack.isLiked ? "fill-current text-red-400" : ""}`} 
              />
            </Button>

            <VolumeControl
              volume={volume}
              onVolumeChange={mockPlayerActions.onVolumeChange}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShowQueue}
              className="text-gray-400 hover:text-white w-10 h-10"
            >
              <ApperIcon name="List" className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShowLyrics}
              className="text-gray-400 hover:text-white w-10 h-10"
            >
              <ApperIcon name="FileText" className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Desktop Lyrics/Queue Panel */}
        <div className="hidden lg:flex w-96 border-l border-gray-700/50 bg-gradient-to-b from-surface/50 to-gray-800/30 backdrop-blur-sm">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Lyrics</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <ApperIcon name="Maximize2" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 text-gray-300 leading-relaxed">
              {currentTrack.lyrics ? (
                currentTrack.lyrics.split('\n').map((line, index) => (
                  <p key={index} className="hover:text-white transition-colors cursor-pointer">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No lyrics available for this song
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;