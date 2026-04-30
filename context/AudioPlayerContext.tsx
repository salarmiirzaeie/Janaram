// AudioPlayerContext.tsx
import NowPlayingBar from "@/components/ui/play-bar";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { useLazyGetBreathingQuery } from "@/services/breathing/breathing-adapter";
import { useLazyGetMeditationQuery } from "@/services/meditations/meditation-adapter";
import { Meditation } from "@/types";
import {
  Audio,
  AVPlaybackStatus,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  trackType: "meditation" | "breathing";
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
  // Hooks
  const [getMeditation, { isLoading: isApiLoading }] =
    useLazyGetMeditationQuery();
  const [getBreathing, { isLoading: isBreathingLoading }] =
    useLazyGetBreathingQuery();

  // State
  const [trackType, setTrackType] = useState<"meditation" | "breathing">(
    "meditation"
  );
  const [track, setTrack] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayingBar, setShowPlayingBar] = useState(true);

  // Refs
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup sound helper
  const cleanupSound = useCallback(async () => {
    if (soundRef.current) {
      soundRef.current.setOnPlaybackStatusUpdate(null);
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  // Configure audio mode on mount
  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
        });
      } catch (error) {
        console.error("Error configuring audio mode:", error);
      }
    };

    configureAudioMode();

    return () => {
      isMountedRef.current = false;
      cleanupSound();
    };
  }, [cleanupSound]);

  // Load track
  const loadTrack = useCallback(
    async (id: string, type?: "meditation" | "breathing") => {
      if (!id || !isMountedRef.current) return;

      setIsLoading(true);

      // Clean up previous sound
      await cleanupSound();

      try {
        let response;
        if (type === "breathing") {
          response = await getBreathing({ id }).unwrap();
        } else {
          response = await getMeditation({ id }).unwrap();
        }

        if (!isMountedRef.current) return;

        const source = { uri: BASE_URL_IMAGES + response.meditation.file };
        const shouldPlay = type !== "breathing"; // meditation plays automatically

        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay,
        });

        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (!isMountedRef.current) return;
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

        soundRef.current = sound;
        setTrack(response.meditation);
        setTrackType(type || "meditation");
        setIsPlaying(shouldPlay);
        setShowPlayingBar(true);
      } catch (error) {
        console.error("Error loading track:", error);
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [getMeditation, getBreathing, cleanupSound]
  );

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
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
  }, []);

  // Seek to position
  const seek = useCallback(async (ms: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(ms);
    }
  }, []);

  // Stop playback
  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
      setShowPlayingBar(false);
    }
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
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
      trackType,
    }),
    [
      track,
      isPlaying,
      position,
      duration,
      loadTrack,
      togglePlay,
      seek,
      stop,
      showPlayingBar,
      isApiLoading,
      isLoading,
      isBreathingLoading,
      trackType,
    ]
  );

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
      <NowPlayingBar />
    </AudioPlayerContext.Provider>
  );
};
