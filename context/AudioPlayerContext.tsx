import NowPlayingBar from "@/components/ui/play-bar";
import { Audio, AVPlaybackStatus } from "expo-av";
import { useSegments } from "expo-router";
import { createContext, useContext, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  file: any;
};

type AudioPlayerContextType = {
  track: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  loadTrack: (track: Track) => Promise<void>;
  togglePlay: () => void;
  seek: (ms: number) => void;
  showPlayingBar: boolean;
  stop: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error("useAudioPlayer must be inside AudioPlayerProvider");
  return ctx;
};

export const AudioPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [showPlayingBar, setShowPlayingBar] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const segments = useSegments();
  const isPlayerScreen = segments[0] === "player";

  const loadTrack = async (newTrack: Track) => {
    if (track?.id === newTrack.id) return;

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }

    const { sound } = await Audio.Sound.createAsync(newTrack.file, {
      shouldPlay: true,
    });

    soundRef.current = sound;
    setTrack(newTrack);
    setIsPlaying(true);
    setShowPlayingBar(true);

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      if ("positionMillis" in status) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
        setIsPlaying(status.isPlaying);
      }
    });
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      setShowPlayingBar(true);
    }
  };

  const seek = async (ms: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(ms);
    }
  };
  const stop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
      setShowPlayingBar(false);
    }
  };
  return (
    <AudioPlayerContext.Provider
      value={{
        track,
        isPlaying,
        position,
        duration,
        loadTrack,
        togglePlay,
        seek,
        stop,
        showPlayingBar,
      }}
    >
      {children}
      {!isPlayerScreen && showPlayingBar && <NowPlayingBar />}
    </AudioPlayerContext.Provider>
  );
};
