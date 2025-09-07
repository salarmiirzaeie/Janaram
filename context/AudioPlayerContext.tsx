import NowPlayingBar from "@/components/ui/play-bar";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { useLazyGetBreathingQuery } from "@/services/breathing/breathing-adapter";
import { useLazyGetMeditationQuery } from "@/services/meditations/meditation-adapter";
import { Meditation } from "@/types";
import { Audio, AVPlaybackStatus, InterruptionModeAndroid } from "expo-av";
import { useSegments } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type AudioPlayerContextType = {
  track: Meditation | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  loadTrack: (id: string, type?: "meditation" | "breathing") => Promise<void>;
  togglePlay: () => void;
  seek: (ms: number) => void;
  showPlayingBar: boolean;
  stop: () => void;
  isLoading: boolean;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be inside AudioPlayerProvider");
  return ctx;
};

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [getMeditation, { data, isLoading: isApiLoading }] = useLazyGetMeditationQuery();
  const [getBreathing, { data: breathing, isLoading: isBreathingLoading }] = useLazyGetBreathingQuery();
  const [track, setTrack] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayingBar, setShowPlayingBar] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const segments = useSegments();
  const isPlayerScreen = segments[0] === "player" || segments[0] === "breathingPlayer";
  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true, // Continue playing in the background
          shouldDuckAndroid: false, // Lower other apps' audio when playing
          playThroughEarpieceAndroid: false, // Use speaker by default
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });
      } catch (error) {
        console.error("Error configuring audio mode:", error);
      }
    };

    configureAudioMode();

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);
  const loadTrack = async (id: string, type?: "meditation" | "breathing") => {
    if (!id) return;
    if (type === "breathing") {
      await getBreathing({ id })
        .unwrap()
        .then(async (res) => {
          try {
            setIsLoading(true);
            if (soundRef.current) {
              await soundRef.current.unloadAsync();
              soundRef.current.setOnPlaybackStatusUpdate(null);
              soundRef.current = null;
            }

            const source = {
              uri: BASE_URL_IMAGES + res.meditation.file,
            };

            // 👇 only load, don't auto-play
            const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });

            soundRef.current = sound;
            setTrack(res.meditation);
            setIsPlaying(false); // not playing yet
            setShowPlayingBar(true);

            sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
              if (!status.isLoaded) return;

              if ("positionMillis" in status) {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis || 1);
                setIsPlaying(status.isPlaying);
              }

              if ("didJustFinish" in status && status.didJustFinish) {
                setIsPlaying(false);
                setShowPlayingBar(false);
              }

              if ("isBuffering" in status) {
                setIsLoading(status.isBuffering);
              }
            });
          } catch (error) {
            console.error("Error loading breathing track:", error);
          } finally {
            setIsLoading(false);
          }
        });
    } else {
      await getMeditation({ id })
        .unwrap()
        .then(async (res) => {
          try {
            setIsLoading(true);
            if (soundRef.current) {
              await soundRef.current.unloadAsync();
              soundRef.current.setOnPlaybackStatusUpdate(null);
              soundRef.current = null;
            }

            const source = {
              uri: BASE_URL_IMAGES + res.meditation.file,
            };

            const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });

            soundRef.current = sound;
            setTrack(res.meditation);
            setIsPlaying(true);
            setShowPlayingBar(true);

            // 🔊 Configure lock screen

            sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
              if (!status.isLoaded) return;

              if ("positionMillis" in status) {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis || 1);
                setIsPlaying(status.isPlaying);

                // 🔁 Update current playback position on lock screen
              }

              if ("didJustFinish" in status && status.didJustFinish) {
                setIsPlaying(false);
                setShowPlayingBar(false);
              }

              if ("isBuffering" in status) {
                setIsLoading(status.isBuffering);
              }
            });
          } catch (error) {
            console.error("Error loading track:", error);
          } finally {
            setIsLoading(false);
          }
        });
    }
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
        isLoading: isApiLoading || isLoading || isBreathingLoading,
      }}
    >
      {children}
      {!isPlayerScreen && showPlayingBar && <NowPlayingBar />}
    </AudioPlayerContext.Provider>
  );
};
