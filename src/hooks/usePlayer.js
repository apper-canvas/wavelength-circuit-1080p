import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

const usePlayer = () => {
  const [playerState, setPlayerState] = useState({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    volume: 0.7,
    queue: [],
    currentIndex: 0,
    shuffleOn: false,
    repeatMode: "none" // "none", "one", "all"
  });

  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = playerState.volume;
      
      audioRef.current.addEventListener("ended", handleTrackEnd);
      audioRef.current.addEventListener("error", handleAudioError);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleTrackEnd);
        audioRef.current.removeEventListener("error", handleAudioError);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.pause();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        progress: 0
      }));
    }
  }, []);

  const handleAudioError = useCallback(() => {
    toast.error("Failed to load audio track");
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (playerState.repeatMode === "one") {
      playTrack(playerState.currentTrack);
    } else {
      skipNext();
    }
  }, [playerState.repeatMode, playerState.currentTrack]);

  // Update progress
  useEffect(() => {
    if (playerState.isPlaying && audioRef.current) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current && audioRef.current.duration) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setPlayerState(prev => ({
            ...prev,
            progress
          }));
        }
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [playerState.isPlaying]);

  const playTrack = useCallback((track, queue = [], startIndex = 0) => {
    if (!track) return;

    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      queue: queue.length > 0 ? queue : [track],
      currentIndex: startIndex,
      isPlaying: true,
      progress: 0
    }));

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl || "";
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio:", err);
        toast.error("Failed to play track");
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !playerState.currentTrack) return;

    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio:", err);
        toast.error("Failed to play track");
      });
    }

    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, [playerState.isPlaying, playerState.currentTrack]);

  const skipNext = useCallback(() => {
    const { queue, currentIndex, shuffleOn, repeatMode } = playerState;
    if (queue.length === 0) return;

    let nextIndex;
    
    if (shuffleOn) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          return; // End of queue
        }
      }
    }

    const nextTrack = queue[nextIndex];
    playTrack(nextTrack, queue, nextIndex);
  }, [playerState, playTrack]);

  const skipPrevious = useCallback(() => {
    const { queue, currentIndex } = playerState;
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex];
    playTrack(prevTrack, queue, prevIndex);
  }, [playerState, playTrack]);

  const seekTo = useCallback((percentage) => {
    if (!audioRef.current || !audioRef.current.duration) return;

    const seekTime = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    
    setPlayerState(prev => ({
      ...prev,
      progress: percentage
    }));
  }, []);

  const setVolume = useCallback((volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }

    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      shuffleOn: !prev.shuffleOn
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => {
      const modes = ["none", "all", "one"];
      const currentModeIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      
      return {
        ...prev,
        repeatMode: nextMode
      };
    });
  }, []);

  const addToQueue = useCallback((tracks) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, ...tracks]
    }));
    
    toast.success(`Added ${tracks.length} track${tracks.length > 1 ? 's' : ''} to queue`);
  }, []);

  const removeFromQueue = useCallback((index) => {
    setPlayerState(prev => {
      const newQueue = [...prev.queue];
      newQueue.splice(index, 1);
      
      let newCurrentIndex = prev.currentIndex;
      if (index < prev.currentIndex) {
        newCurrentIndex--;
      } else if (index === prev.currentIndex && newQueue.length > 0) {
        if (newCurrentIndex >= newQueue.length) {
          newCurrentIndex = 0;
        }
        // If we removed the current track, play the next one
        const nextTrack = newQueue[newCurrentIndex];
        if (nextTrack) {
          setTimeout(() => playTrack(nextTrack, newQueue, newCurrentIndex), 0);
        }
      }
      
      return {
        ...prev,
        queue: newQueue,
        currentIndex: Math.max(0, newCurrentIndex)
      };
    });
  }, [playTrack]);

  const clearQueue = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      queue: prev.currentTrack ? [prev.currentTrack] : [],
      currentIndex: 0
    }));
  }, []);

  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const getCurrentTime = useCallback(() => {
    return audioRef.current ? audioRef.current.currentTime : 0;
  }, []);

  const getDuration = useCallback(() => {
    return audioRef.current ? audioRef.current.duration : 0;
  }, []);

  return {
    playerState,
    playTrack,
    togglePlay,
    skipNext,
    skipPrevious,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
    clearQueue,
    formatTime,
    getCurrentTime,
    getDuration
  };
};

export default usePlayer;