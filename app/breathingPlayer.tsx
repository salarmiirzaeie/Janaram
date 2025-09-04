import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function BreathingPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { track, isPlaying, position, duration, loadTrack, togglePlay, seek, isLoading } = useAudioPlayer();

  const INHALE_DURATION = 4000; // ms
  const EXHALE_DURATION = 4000; // ms

  const scale = useSharedValue(1);
  const colorPhase = useSharedValue(0); // 0 = inhale, 1 = exhale
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [phaseSeconds, setPhaseSeconds] = useState(INHALE_DURATION / 1000);

  // Load track
  useEffect(() => {
    if (id) loadTrack(id);
  }, [id]);

  // Breathing animation + color
  useEffect(() => {
    if (!isPlaying) {
      scale.value = 1;
      colorPhase.value = 0;
      return;
    }

    scale.value = withRepeat(
      withTiming(1.3, { duration: INHALE_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    const interval = setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          const newPhase = phase === "inhale" ? "exhale" : "inhale";
          setPhase(newPhase);
          colorPhase.value = newPhase === "inhale" ? 0 : 1;
          Vibration.vibrate(50); // لرزش کوتاه هنگام تغییر فاز
          return newPhase === "inhale" ? INHALE_DURATION / 1000 : EXHALE_DURATION / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      colorPhase.value,
      [0, 1],
      ["rgba(76, 175, 80, 0.2)", "rgba(33, 150, 243, 0.2)"] // سبز inhale / آبی exhale
    ),
  }));

  const formatMillis = (millis: number) => {
    const mins = Math.floor(millis / 60000);
    const secs = Math.floor((millis % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!id) return <Text style={{ padding: 20 }}>Breathing track not found</Text>;

  return (
    <View className="p-safe flex-1 bg-white p-8 justify-center items-center">
      <Animated.View style={[styles.circle, animatedStyle]}>
        <Image source={{ uri: BASE_URL_IMAGES + track?.image }} style={styles.cover} />
        <Text style={styles.phaseText}>{phase.toUpperCase()}</Text>
        <Text style={styles.phaseSeconds}>{phaseSeconds}</Text>
      </Animated.View>

      <Text style={styles.title}>{track?.title}</Text>
      <Text style={styles.artist}>{track?.description}</Text>

      <Slider size="md" value={position} minValue={0} maxValue={duration} onChange={seek} className="w-11/12">
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatMillis(position)}</Text>
        <Text style={styles.time}>{formatMillis(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <Ionicons name="play-skip-back" size={32} color="#666" />
        <Pressable onPress={togglePlay}>
          {isLoading ? (
            <View style={styles.playButtonLoading}>
              <Spinner color={"#fff"} />
            </View>
          ) : (
            <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={68} color="#4caf50" />
          )}
        </Pressable>
        <Ionicons name="play-skip-forward" size={32} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#dcdcdc",
    position: "relative",
  },
  cover: {
    width: 180,
    height: 180,
    borderRadius: 90,
    position: "absolute",
    top: 30,
    left: 30,
  },
  phaseText: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "700",
    color: "#4caf50",
    textAlign: "center",
    top: 100,
    fontFamily: "vazirBold",
  },
  phaseSeconds: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "600",
    color: "#4caf50",
    textAlign: "center",
    top: 130,
    fontFamily: "vazir",
  },
  title: {
    color: "#2e2e2e",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "vazirBold",
    marginHorizontal: 20,
    textAlign: "center",
  },
  artist: {
    color: "#888",
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    marginHorizontal: 20,
    fontFamily: "vazir",
  },
  timeRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    color: "#aaa",
    fontSize: 13,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    alignItems: "center",
    marginTop: 40,
  },
  playButtonLoading: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4caf50",
    borderRadius: 34,
  },
});
