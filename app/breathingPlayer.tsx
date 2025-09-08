import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import { TapGestureHandler, TapGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function BreathingPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { track, isPlaying, position, duration, loadTrack, togglePlay, seek, isLoading } = useAudioPlayer();
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Durations in ms (fallbacks)
  const INHALE_DURATION = track?.inhaleDuration ?? 6000;
  const EXHALE_DURATION = track?.exhaleDuration ?? 6000;
  const HOLD_DURATION = track?.holdDuration ?? 0;

  // Shared values for animations & countdown
  const scale = useSharedValue(1);
  const phaseShared = useSharedValue<"inhale" | "hold_after_inhale" | "exhale" | "hold_after_exhale">("inhale");
  const secondsShared = useSharedValue(INHALE_DURATION / 1000);
  const progress = useSharedValue(0);

  // React state to show on UI
  const [phaseText, setPhaseText] = useState<"inhale" | "hold_after_inhale" | "exhale" | "hold_after_exhale">("inhale");
  const [phaseSeconds, setPhaseSeconds] = useState(INHALE_DURATION / 1000);
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (!isLoading && id === track?.id) {
      setInitialLoading(false);
    }
  }, [track, isLoading]);
  // Sync UI from Reanimated shared values
  useAnimatedReaction(
    () => phaseShared.value,
    (phase) => {
      runOnJS(setPhaseText)(phase);
    }
  );

  useAnimatedReaction(
    () => secondsShared.value,
    (secs) => {
      runOnJS(setPhaseSeconds)(Math.ceil(secs));
    }
  );

  // Update progress smoothly when position changes
  useEffect(() => {
    progress.value = withTiming(duration ? (position / duration) * 100 : 0, { duration: 100 });
  }, [position, duration]);

  // Helper to start countdown for UI
  const startPhaseCountdown = (phaseDurationMs: number) => {
    secondsShared.value = phaseDurationMs / 1000;
    secondsShared.value = withTiming(0, { duration: phaseDurationMs });
  };

  useEffect(() => {
    if (!isPlaying) {
      scale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
      phaseShared.value = "inhale";
      secondsShared.value = INHALE_DURATION / 1000;
      return;
    }

    phaseShared.value = "inhale";
    startPhaseCountdown(INHALE_DURATION);

    const seq: any[] = [];
    seq.push(
      withTiming(1.3, { duration: INHALE_DURATION, easing: Easing.inOut(Easing.ease) }, (finished) => {
        if (!finished) return;
        runOnJS(Vibration.vibrate)(50);
        if (HOLD_DURATION > 0) {
          phaseShared.value = "hold_after_inhale";
          secondsShared.value = HOLD_DURATION / 1000;
          secondsShared.value = withTiming(0, { duration: HOLD_DURATION });
        } else {
          phaseShared.value = "exhale";
          secondsShared.value = EXHALE_DURATION / 1000;
          secondsShared.value = withTiming(0, { duration: EXHALE_DURATION });
        }
      })
    );

    if (HOLD_DURATION > 0) {
      seq.push(
        withTiming(1.3, { duration: HOLD_DURATION }, (finished) => {
          if (!finished) return;
          runOnJS(Vibration.vibrate)(50);
          phaseShared.value = "exhale";
          secondsShared.value = EXHALE_DURATION / 1000;
          secondsShared.value = withTiming(0, { duration: EXHALE_DURATION });
        })
      );
    }

    seq.push(
      withTiming(1, { duration: EXHALE_DURATION, easing: Easing.inOut(Easing.ease) }, (finished) => {
        if (!finished) return;
        runOnJS(Vibration.vibrate)(50);
        if (HOLD_DURATION > 0) {
          phaseShared.value = "hold_after_exhale";
          secondsShared.value = HOLD_DURATION / 1000;
          secondsShared.value = withTiming(0, { duration: HOLD_DURATION });
        } else {
          phaseShared.value = "inhale";
          secondsShared.value = INHALE_DURATION / 1000;
          secondsShared.value = withTiming(0, { duration: INHALE_DURATION });
        }
      })
    );

    if (HOLD_DURATION > 0) {
      seq.push(
        withTiming(1, { duration: HOLD_DURATION }, (finished) => {
          if (!finished) return;
          runOnJS(Vibration.vibrate)(50);
          phaseShared.value = "inhale";
          secondsShared.value = INHALE_DURATION / 1000;
          secondsShared.value = withTiming(0, { duration: INHALE_DURATION });
        })
      );
    }

    scale.value = withRepeat(withSequence(...seq), -1, false);
  }, [isPlaying, INHALE_DURATION, EXHALE_DURATION, HOLD_DURATION, scale, phaseShared, secondsShared]);

  useEffect(() => {
    if (id && id !== track?.id) {
      loadTrack(id, "breathing");
    }
  }, [id]);

  const formatMillis = (millis: number) => {
    const mins = Math.floor(millis / 60000);
    const secs = Math.floor((millis % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Tap to seek
  const onTap = ({ nativeEvent: { x } }: TapGestureHandlerGestureEvent) => {
    if (!progressBarWidth || !duration) return;
    const newPos = (x / progressBarWidth) * duration;
    runOnJS(seek)(newPos);
    progress.value = withTiming((newPos / duration) * 100, { duration: 100 });
  };

  // Animated style for the filled progress bar
  const filledStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  // Animated style for the thumb
  const thumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 100], [0, progressBarWidth - 20]);
    return { transform: [{ translateX }] };
  });

  if (!id) return <Text style={{ padding: 20 }}>Breathing track not found</Text>;

  return (
    <View className="p-safe flex-1 bg-white p-8 justify-center items-center">
      <Text style={styles.phaseText}>
        {phaseText === "inhale" ? "دم" : phaseText === "exhale" ? "بازدم" : "حبس نفس"}
      </Text>
      <Text style={styles.phaseSeconds}>{phaseSeconds}</Text>
      <Animated.View
        style={[
          styles.circle,
          useAnimatedStyle(() => {
            return {
              transform: [{ scale: scale.value }],
              backgroundColor: interpolateColor(
                scale.value,
                [1, 1.3],
                ["rgba(33, 150, 243, 0.2)", "rgba(76, 175, 80, 0.2)"]
              ),
            };
          }),
        ]}
      >
        <Image source={{ uri: BASE_URL_IMAGES + track?.image }} style={styles.cover} />
      </Animated.View>

      <Text style={styles.title}>{track?.title}</Text>

      <TapGestureHandler onHandlerStateChange={onTap}>
        <Animated.View
          style={styles.progressBarContainer}
          onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
        >
          <View style={styles.progressBarBackground} />
          <Animated.View style={[styles.progressBarFilled, filledStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </Animated.View>
      </TapGestureHandler>

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
            <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={68} color="#47A9DA" />
          )}
        </Pressable>
        <Ionicons name="play-skip-forward" size={32} color="#666" />
      </View>

      <Actionsheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          {initialLoading ? (
            <VStack space="lg" className="p-4 items-center justify-center w-full">
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonDesc} />
              <View style={styles.skeletonButton} />
            </VStack>
          ) : (
            <View className="w-full">
              <VStack space="lg" className="p-4 items-center justify-center">
                <Text className="text-lg font-vazirBold text-center">{track?.title}</Text>
                <Text className="text-md text-gray-500 text-right">{track?.description}</Text>
              </VStack>
              <Button
                className="w-full mb-4"
                onPress={() => {
                  setIsSheetOpen(false);
                  togglePlay();
                }}
              >
                <ButtonText>شروع</ButtonText>
              </Button>
            </View>
          )}
        </ActionsheetContent>
      </Actionsheet>
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
    marginBottom: 50,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    fontFamily: "vazirBold",
  },
  phaseSeconds: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
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
  progressBarContainer: {
    width: "90%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    overflow: "visible",
    marginBottom: 12,
    justifyContent: "center",
  },
  progressBarFilled: {
    height: 12,
    backgroundColor: "#47A9DA",
    borderRadius: 6,
  },
  thumb: {
    position: "absolute",
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#47A9DA",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0",
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
    backgroundColor: "#47A9DA",
    borderRadius: 34,
  },
  skeletonTitle: {
    width: "70%",
    height: 20,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  skeletonDesc: {
    width: "90%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginTop: 6,
  },
  skeletonButton: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#d6d6d6",
    marginTop: 20,
  },
});
