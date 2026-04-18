import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function PlayerScreen() {
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

  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progress = useSharedValue(0);
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (!isLoading && id === track?.id) {
      setInitialLoading(false);

      // once we have the track, stop showing skeleton
    }
  }, [track, isLoading]);
  useEffect(() => {
    if (id && id !== track?.id) loadTrack(id);
  }, [id]);

  // Update progress smoothly when position changes
  useEffect(() => {
    progress.value = withTiming(duration ? (position / duration) * 100 : 0, {
      duration: 100,
    });
  }, [position, duration]);

  const formatMillis = (millis: number) => {
    const mins = Math.floor(millis / 60000);
    const secs = Math.floor((millis % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Animated style for the filled progress bar
  const filledStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  // Animated style for the thumb
  const thumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 100],
      [0, progressBarWidth - 20]
    ); // thumb width 20
    return { transform: [{ translateX }] };
  });

  // Tap to seek
  const onTap = ({ nativeEvent: { x } }: TapGestureHandlerGestureEvent) => {
    if (!progressBarWidth || !duration) return;
    const newPos = (x / progressBarWidth) * duration;
    runOnJS(seek)(newPos);
    progress.value = withTiming((newPos / duration) * 100, { duration: 100 });
  };

  if (!id) return <Text style={{ padding: 20 }}>Track not found</Text>;

  return (
    <View className="p-safe flex-1 bg-white p-8 justify-center items-center">
      {initialLoading ? (
        <View className="w-full items-center">
          <View style={styles.skeletonCover} />
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonDesc} />
          <View style={styles.skeletonSlider} />
          <View style={styles.skeletonTimeRow}>
            <View style={styles.skeletonTime} />
            <View style={styles.skeletonTime} />
          </View>
          <View style={styles.skeletonControls} />
        </View>
      ) : (
        <View className="w-full items-center">
          <Image
            source={{ uri: BASE_URL_IMAGES + track?.image }}
            style={styles.cover}
          />
          <Text style={styles.title}>{track?.title}</Text>
          <Text style={styles.artist}>{track?.description}</Text>

          {/* Progress Bar */}
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
            <Ionicons
              name="play-skip-back"
              size={32}
              color="#666"
              onPress={() => seek(position - 10000)}
            />
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={68}
              color="#47A9DA"
              onPress={togglePlay}
            />
            <Ionicons
              name="play-skip-forward"
              size={32}
              color="#666"
              onPress={() => seek(position + 10000)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#dcdcdc",
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
  progressBarContainer: {
    width: "90%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    overflow: "visible", // allow thumb to go outside
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
    top: -6, // move thumb above the bar
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
  skeletonCover: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 30,
    backgroundColor: "#e0e0e0",
  },
  skeletonTitle: {
    width: "60%",
    height: 20,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  skeletonDesc: {
    width: "80%",
    height: 16,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 30,
  },
  skeletonSlider: {
    width: "90%",
    height: 6,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonTimeRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },
  skeletonTime: {
    width: 40,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  skeletonControls: {
    width: "70%",
    height: 68,
    borderRadius: 34,
    backgroundColor: "#e0e0e0",
    marginTop: 40,
  },
});
