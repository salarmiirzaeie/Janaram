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
import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  Easing,
  FadeIn,
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
  const {
    track,
    isPlaying,
    position,
    duration,
    loadTrack,
    togglePlay,
    seek,
    isLoading,
  } = useAudioPlayer();
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const INHALE_DURATION = track?.inhaleDuration ?? 6000;
  const EXHALE_DURATION = track?.exhaleDuration ?? 6000;
  const HOLD_DURATION = track?.holdDuration ?? 0;

  const scale = useSharedValue(1);
  const phaseShared = useSharedValue<
    "inhale" | "hold_after_inhale" | "exhale" | "hold_after_exhale"
  >("inhale");
  const secondsShared = useSharedValue(INHALE_DURATION / 1000);
  const progress = useSharedValue(0);

  const [phaseText, setPhaseText] = useState<
    "inhale" | "hold_after_inhale" | "exhale" | "hold_after_exhale"
  >("inhale");
  const [phaseSeconds, setPhaseSeconds] = useState(INHALE_DURATION / 1000);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && id === track?.id) {
      setInitialLoading(false);
    }
  }, [track, isLoading]);

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

  useEffect(() => {
    progress.value = withTiming(duration ? (position / duration) * 100 : 0, {
      duration: 100,
    });
  }, [position, duration]);

  const startPhaseCountdown = (phaseDurationMs: number) => {
    secondsShared.value = phaseDurationMs / 1000;
    secondsShared.value = withTiming(0, { duration: phaseDurationMs });
  };

  useEffect(() => {
    if (!isPlaying) {
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      });
      phaseShared.value = "inhale";
      secondsShared.value = INHALE_DURATION / 1000;
      return;
    }

    phaseShared.value = "inhale";
    startPhaseCountdown(INHALE_DURATION);

    const seq: any[] = [];
    seq.push(
      withTiming(
        1.3,
        { duration: INHALE_DURATION, easing: Easing.inOut(Easing.ease) },
        (finished) => {
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
        }
      )
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
      withTiming(
        1,
        { duration: EXHALE_DURATION, easing: Easing.inOut(Easing.ease) },
        (finished) => {
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
        }
      )
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
  }, [isPlaying, INHALE_DURATION, EXHALE_DURATION, HOLD_DURATION]);

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

  const onTap = ({ nativeEvent: { x } }: TapGestureHandlerGestureEvent) => {
    if (!progressBarWidth || !duration) return;
    const newPos = (x / progressBarWidth) * duration;
    runOnJS(seek)(newPos);
    progress.value = withTiming((newPos / duration) * 100, { duration: 100 });
  };

  const filledStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 100],
      [0, progressBarWidth - 20]
    );
    return { transform: [{ translateX }] };
  });

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        scale.value,
        [1, 1.3],
        ["rgba(121, 174, 214, 0.15)", "rgba(153, 102, 204, 0.15)"]
      ),
    };
  });

  const getPhaseLabel = () => {
    if (phaseText === "inhale")
      return { text: "دم", icon: "🌬️", color: "#79AED6" };
    if (phaseText === "exhale")
      return { text: "بازدم", icon: "💨", color: "#9966CC" };
    return { text: "حبس نفس", icon: "✨", color: "#FF9966" };
  };

  const phase = getPhaseLabel();

  if (!id)
    return <Text style={{ padding: 20 }}>Breathing track not found</Text>;

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/80 justify-center items-center shadow-sm"
          >
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="font-vazirBold text-primary-600 text-base">
            تمرین تنفس
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 justify-center items-center px-6">
          {/* Phase Indicator */}
          <Animated.View
            entering={FadeIn.duration(400)}
            className="items-center mb-4"
          >
            <View className="bg-primary-100 px-4 py-2 rounded-full flex-row items-center gap-2">
              <Text className="text-2xl">{phase.icon}</Text>
              <Text className="text-primary-700 font-vazirBold text-lg">
                {phase.text}
              </Text>
            </View>
          </Animated.View>

          {/* Countdown Timer */}
          <Animated.View entering={FadeIn.duration(400).delay(50)}>
            <Text className="text-7xl font-vazirBold text-primary-600 mb-2">
              {phaseSeconds}
            </Text>
            <Text className="text-gray-400 font-vazir text-sm text-center">
              ثانیه
            </Text>
          </Animated.View>

          {/* Breathing Circle */}
          <Animated.View
            entering={FadeIn.duration(600).delay(100)}
            style={styles.circleContainer}
          >
            <Animated.View style={[styles.circle, circleAnimatedStyle]}>
              <LinearGradient
                colors={["#79AED6", "#9966CC"]}
                style={styles.circleGradient}
              >
                <Image
                  source={{ uri: BASE_URL_IMAGES + track?.image }}
                  style={styles.cover}
                />
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          {/* Track Title */}
          <Text style={styles.title}>{track?.title}</Text>

          {/* Progress Bar */}
          <TapGestureHandler onHandlerStateChange={onTap}>
            <Animated.View
              style={styles.progressBarContainer}
              onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
            >
              <View style={styles.progressBarBackground} />
              <LinearGradient
                colors={["#79AED6", "#9966CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFilled, filledStyle]}
              />
              <Animated.View style={[styles.thumb, thumbStyle]} />
            </Animated.View>
          </TapGestureHandler>

          {/* Time Row */}
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatMillis(position)}</Text>
            <Text style={styles.time}>{formatMillis(duration)}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => seek(position - 10000)}
              className="items-center gap-1"
            >
              <View className="bg-primary-100 rounded-full p-3">
                <Ionicons name="play-skip-back" size={28} color="#79AED6" />
              </View>
              <Text className="text-gray-400 font-vazir text-xs">۱۰ ثانیه</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlay}>
              <LinearGradient
                colors={["#79AED6", "#9966CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playButton}
              >
                {isLoading ? (
                  <Spinner color="#fff" size="large" />
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={42}
                    color="white"
                    style={{ marginLeft: isPlaying ? 0 : 2 }}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => seek(position + 10000)}
              className="items-center gap-1"
            >
              <View className="bg-primary-100 rounded-full p-3">
                <Ionicons name="play-skip-forward" size={28} color="#79AED6" />
              </View>
              <Text className="text-gray-400 font-vazir text-xs">۱۰ ثانیه</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Sheet */}
        <Actionsheet
          isOpen={isSheetOpen}
          closeOnOverlayClick={false}
          onClose={() => setIsSheetOpen(false)}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent className="bg-white rounded-t-3xl">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>

            {initialLoading ? (
              <VStack
                space="lg"
                className="p-4 items-center justify-center w-full"
              >
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDesc} />
                <View style={styles.skeletonDesc} />
                <View style={styles.skeletonDesc} />
                <View style={styles.skeletonButton} />
              </VStack>
            ) : (
              <View className="w-full">
                <VStack space="md" className="p-4 items-center">
                  <LinearGradient
                    colors={["#79AED6", "#9966CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 60,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <Feather name="wind" size={40} color="white" />
                  </LinearGradient>
                  <Text className="text-2xl font-vazirBold text-primary-800 text-center">
                    {track?.title}
                  </Text>
                  <Text className="text-base text-gray-600 text-right font-vazir leading-6">
                    {track?.description}
                  </Text>

                  <View className="flex-row justify-around w-full mt-4 pt-4 border-t border-gray-100">
                    <View className="items-center">
                      <Text className="text-primary-500 font-vazirBold text-lg">
                        {(INHALE_DURATION / 1000).toFixed(0)}
                      </Text>
                      <Text className="text-gray-400 font-vazir text-xs">
                        دم (ثانیه)
                      </Text>
                    </View>
                    {HOLD_DURATION > 0 && (
                      <View className="items-center">
                        <Text className="text-primary-500 font-vazirBold text-lg">
                          {(HOLD_DURATION / 1000).toFixed(0)}
                        </Text>
                        <Text className="text-gray-400 font-vazir text-xs">
                          حبس (ثانیه)
                        </Text>
                      </View>
                    )}
                    <View className="items-center">
                      <Text className="text-primary-500 font-vazirBold text-lg">
                        {(EXHALE_DURATION / 1000).toFixed(0)}
                      </Text>
                      <Text className="text-gray-400 font-vazir text-xs">
                        بازدم (ثانیه)
                      </Text>
                    </View>
                  </View>
                </VStack>
                <Button
                  className="w-full mb-4 bg-primary-500 rounded-2xl"
                  onPress={() => {
                    setIsSheetOpen(false);
                    togglePlay();
                  }}
                >
                  <ButtonText className="font-vazirBold">شروع تمرین</ButtonText>
                </Button>
              </View>
            )}
          </ActionsheetContent>
        </Actionsheet>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  circle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#79AED6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  circleGradient: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  title: {
    color: "#2e2e2e",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "vazirBold",
    textAlign: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e0e0e0",
    overflow: "visible",
    marginBottom: 10,
    justifyContent: "center",
  },
  progressBarFilled: {
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#9966CC",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "white",
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  timeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    color: "#aaa",
    fontSize: 12,
    fontFamily: "vazir",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#79AED6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  skeletonTitle: {
    width: "70%",
    height: 24,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  skeletonDesc: {
    width: "90%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
  skeletonButton: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#d6d6d6",
    marginTop: 20,
  },
});
