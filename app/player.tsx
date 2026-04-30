import BannerAd from "@/components/home/BannerAd";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  FadeIn,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

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
  const [isLiked, setIsLiked] = useState(false);
  const scale = useSharedValue(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (!isLoading && id === track?.id) {
      setInitialLoading(false);
    }
  }, [track, isLoading]);

  useEffect(() => {
    if (id && id !== track?.id) loadTrack(id);
  }, [id]);

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

  const onTap = ({ nativeEvent: { x } }: TapGestureHandlerGestureEvent) => {
    if (!progressBarWidth || !duration) return;
    const newPos = (x / progressBarWidth) * duration;
    runOnJS(seek)(newPos);
    progress.value = withTiming((newPos / duration) * 100, { duration: 100 });
  };

  const handleLike = () => {
    scale.value = withSpring(1.2, { damping: 3, stiffness: 200 });
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 200);
    setIsLiked(!isLiked);
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!id) return <Text style={{ padding: 20 }}>Track not found</Text>;

  return (
    <View style={styles.container}>
      {/* Background Image with Blur */}
      <Image
        source={{ uri: track?.image2 }}
        style={styles.backgroundImage}
        blurRadius={30}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.overlay}
      />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {initialLoading ? (
        <View style={styles.skeletonContainer}>
          {/* Header Skeleton */}

          <View style={styles.skeletonContent}>
            {/* Album Art Skeleton */}
            <View>
              <View style={styles.skeletonArtworkContainer}>
                <View style={styles.skeletonCover} />
              </View>

              {/* Track Info Skeleton */}
              <View style={styles.skeletonInfoContainer}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDesc} />
              </View>

              {/* Progress Section Skeleton */}
              <View style={styles.skeletonProgressSection}>
                <View style={styles.skeletonSlider} />
                <View style={styles.skeletonTimeRow} />
              </View>
            </View>

            {/* Controls Skeleton */}
            <View style={styles.skeletonControls}>
              <View style={styles.skeletonSkipButton} />
              <View style={styles.skeletonPlayButton} />
              <View style={styles.skeletonSkipButton} />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Album Art - Square */}
          <Animated.View
            entering={FadeInUp.duration(600).springify()}
            style={styles.artworkContainer}
          >
            <View style={styles.artworkWrapper}>
              <Image source={{ uri: track?.image2 }} style={styles.artwork} />
              {isPlaying && (
                <View style={styles.playingOverlay}>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.5)"]}
                    style={styles.playingOverlayGradient}
                  >
                    <View style={styles.playingIndicator}>
                      <View style={styles.waveBar} />
                      <View style={[styles.waveBar, { height: 20 }]} />
                      <View style={[styles.waveBar, { height: 28 }]} />
                      <View style={[styles.waveBar, { height: 20 }]} />
                      <View style={styles.waveBar} />
                    </View>
                  </LinearGradient>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Track Info */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(100)}
            style={styles.infoContainer}
          >
            <Text style={styles.title} numberOfLines={1}>
              {track?.title}
            </Text>
            <TouchableOpacity
              onPress={() => setDescriptionExpanded(!descriptionExpanded)}
            >
              <Text
                numberOfLines={descriptionExpanded ? 3 : 2}
                style={styles.description}
              >
                {track?.description || "بدون توضیحات"}
              </Text>
              {track?.description && track.description.length > 80 && (
                <Text style={styles.readMore}>
                  {descriptionExpanded ? "بستن" : "بیشتر"}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Action Buttons */}

          {/* Progress Section */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(300)}
            style={styles.progressSection}
          >
            <TapGestureHandler onHandlerStateChange={onTap}>
              <Animated.View
                style={styles.progressBarContainer}
                onLayout={(e) =>
                  setProgressBarWidth(e.nativeEvent.layout.width)
                }
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

            <View style={styles.timeRow}>
              <Text style={styles.time}>{formatMillis(position)}</Text>
              <Text style={styles.time}>{formatMillis(duration)}</Text>
            </View>
          </Animated.View>

          {/* Main Controls */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(400)}
            style={styles.controls}
          >
            <TouchableOpacity
              onPress={() => seek(position - 10000)}
              style={styles.skipButton}
            >
              <Ionicons name="play-skip-back" size={32} color="white" />
              <Text style={styles.skipLabel}>10 s</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
              <LinearGradient
                colors={["#79AED6", "#9966CC"]}
                style={styles.playButtonGradient}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={44}
                  color="white"
                  style={{ marginLeft: isPlaying ? 0 : 3 }}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => seek(position + 10000)}
              style={styles.skipButton}
            >
              <Ionicons name="play-skip-forward" size={32} color="white" />
              <Text style={styles.skipLabel}>10 s</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Options */}
          {/* <Animated.View
            entering={FadeInUp.duration(600).delay(500)}
            style={styles.bottomOptions}
          >
            <TouchableOpacity style={styles.optionButton}>
              <Ionicons
                name="list-outline"
                size={22}
                color="rgba(255,255,255,0.5)"
              />
              <Text style={styles.optionLabel}>لیست پخش</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Ionicons
                name="timer-outline"
                size={22}
                color="rgba(255,255,255,0.5)"
              />
              <Text style={styles.optionLabel}>خواب</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Ionicons
                name="musical-notes-outline"
                size={22}
                color="rgba(255,255,255,0.5)"
              />
              <Text style={styles.optionLabel}>کیفیت</Text>
            </TouchableOpacity>
          </Animated.View> */}
        </View>
      )}
      <BannerAd bannerSize="BANNER" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
  },
  overlay: {
    position: "absolute",
    width: width,
    height: height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    fontFamily: "vazirBold",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 150,
  },
  artworkContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  artworkWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  playingOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  playingOverlayGradient: {
    padding: 15,
    alignItems: "flex-end",
  },
  playingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  waveBar: {
    width: 3,
    height: 12,
    backgroundColor: "white",
    borderRadius: 2,
  },
  infoContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 25,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "vazirBold",
    textAlign: "center",
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "vazir",
    lineHeight: 22,
  },
  readMore: {
    color: "#79AED6",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "vazir",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 35,
    marginTop: 20,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressSection: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
  },
  timeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: "vazir",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 45,
    marginTop: 20,
  },
  skipButton: {
    alignItems: "center",
    gap: 4,
  },
  skipLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "vazir",
  },
  playButton: {
    shadowColor: "#79AED6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 50,
    marginBottom: 40,
    marginTop: 15,
  },
  optionButton: {
    alignItems: "center",
    gap: 6,
  },
  optionLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontFamily: "vazir",
  },
  skeletonContainer: {
    flex: 1,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 150,
  },
  skeletonBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonArtworkContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  skeletonCover: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 25,
  },
  skeletonTitle: {
    width: 200,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  skeletonDesc: {
    width: 250,
    height: 44,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonProgressSection: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  skeletonSlider: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
  },
  skeletonTimeRow: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 45,
    marginTop: 20,
  },
  skeletonSkipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
