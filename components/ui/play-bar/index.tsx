import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HStack } from "../hstack";

export default function NowPlayingBar() {
  const {
    track,
    isPlaying,
    position,
    duration,
    trackType,
    loadTrack,
    togglePlay,
    seek,
    stop,
  } = useAudioPlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scalePlay = useSharedValue(1);
  const scaleClose = useSharedValue(1);

  if (!track) return null;

  const progressPercent = duration ? (position / duration) * 100 : 0;

  const handlePressInPlay = () => {
    scalePlay.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOutPlay = () => {
    scalePlay.value = withTiming(1, { duration: 100 });
  };

  const handlePressInClose = () => {
    scaleClose.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOutClose = () => {
    scaleClose.value = withTiming(1, { duration: 100 });
  };

  const playAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scalePlay.value }],
  }));

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleClose.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      style={{
        position: "absolute",
        bottom: 70 + insets.bottom,
        left: 16,
        right: 16,
        zIndex: 100,
      }}
    >
      <LinearGradient
        colors={["#FFFFFF", "#F9F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          overflow: "hidden",
        }}
      >
        {/* Progress Bar */}
        <View style={{ height: 3, backgroundColor: "#F0F0F0" }}>
          <LinearGradient
            colors={["#79AED6", "#9966CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${progressPercent}%`,
              height: 3,
            }}
          />
        </View>

        {/* Content */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
          }}
        >
          {/* Artwork */}
          <Pressable
            onPress={() =>
              router.push({
                pathname:
                  trackType === "meditation" ? "/player" : "/breathingPlayer",
                params: { id: track.id },
              })
            }
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: BASE_URL_IMAGES + track.image }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E9EDF2",
                }}
              />
              {isPlaying && (
                <View
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    backgroundColor: "#79AED6",
                    borderRadius: 10,
                    padding: 2,
                  }}
                >
                  <Feather name="play" size={8} color="white" />
                </View>
              )}
            </View>
          </Pressable>

          {/* Track Info */}
          <Pressable
            onPress={() =>
              router.push({
                pathname:
                  trackType === "meditation" ? "/player" : "/breathingPlayer",
                params: { id: track.id },
              })
            }
            style={{ flex: 1, marginLeft: 12 }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#2e2e2e",
                fontSize: 13,
                fontFamily: "vazirBold",
                textAlign: "right",
              }}
            >
              {track.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: "#999",
                fontSize: 10,
                fontFamily: "vazir",
                textAlign: "right",
                marginTop: 2,
              }}
            >
              {trackType === "meditation" ? "مدیتیشن" : "تمرین تنفس"}
            </Text>
          </Pressable>

          {/* Controls */}
          <HStack space="md" className="items-center">
            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={togglePlay}
              onPressIn={handlePressInPlay}
              onPressOut={handlePressOutPlay}
              activeOpacity={0.8}
            >
              <Animated.View style={playAnimatedStyle}>
                <LinearGradient
                  colors={["#79AED6", "#9966CC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#79AED6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={20}
                    color="white"
                    style={{ marginLeft: isPlaying ? 0 : 1 }}
                  />
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              onPress={stop}
              onPressIn={handlePressInClose}
              onPressOut={handlePressOutClose}
              activeOpacity={0.8}
            >
              <Animated.View style={closeAnimatedStyle}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#F5F5F5",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="close" size={18} color="#999" />
                </View>
              </Animated.View>
            </TouchableOpacity>
          </HStack>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
