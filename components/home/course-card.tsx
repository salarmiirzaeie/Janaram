import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { toPersianDigits, typeTopPersian } from "@/utils/persian";
import { Entypo, Ionicons } from "@expo/vector-icons";
// import { Adivery } from "adivery";
import { router } from "expo-router";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { showAd } from "./BannerAd";

// ---------- STATIC PRE-COMPUTATIONS ----------
const STATIC_STYLES = StyleSheet.create({
  container: { marginHorizontal: 6 },
  gradient: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.15,
  },
  decorativeTop: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorativeBottom: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  proBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 10,
  },
  proText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "vazir",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 13,
  },
  durationBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    color: "white",
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "vazir",
  },
  title: {
    fontFamily: "vazir",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "vazir",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: { gap: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});

// Pre-compute color arrays once (as mutable arrays for LinearGradient)
const BASE_COLORS = [
  {
    gradient: ["#79AED6", "#5E95BD"],
    gradientStart: "#79AED6",
    accent: "#A5C9E1",
  },
  {
    gradient: ["#9966CC", "#804DB3"],
    gradientStart: "#9966CC",
    accent: "#C2A3E1",
  },
  {
    gradient: ["#FF9966", "#E6804D"],
    gradientStart: "#FF9966",
    accent: "#FFC2A3",
  },
  {
    gradient: ["#91A5BE", "#7A8BA8"],
    gradientStart: "#91A5BE",
    accent: "#BDC9D8",
  },
  {
    gradient: ["#79AED6", "#9966CC"],
    gradientStart: "#79AED6",
    accent: "#D6C2EB",
  },
  {
    gradient: ["#FF9966", "#9966CC"],
    gradientStart: "#FF9966",
    accent: "#FFD6C2",
  },
];

const CATEGORY_ORDER: Record<string, readonly number[]> = {
  calm: [0, 1, 2, 3, 4, 5],
  self: [5, 4, 0, 1, 2, 3],
  instrumental: [1, 2, 0, 4, 5, 3],
  sleep: [0, 2, 1, 3, 5, 4],
  love: [3, 1, 0, 5, 4, 2],
  nature: [2, 1, 4, 5, 0, 3],
};

// Pre-compute color cache with LRU (limit 100)
const colorCache = new Map<string, (typeof BASE_COLORS)[0]>();
const getColorSet = (type: string, index: number) => {
  const key = `${type}:${index % 10}`;
  if (colorCache.has(key)) return colorCache.get(key)!;
  const order = CATEGORY_ORDER[type];
  const colorIndex = order
    ? order[index % order.length]
    : index % BASE_COLORS.length;
  const result = BASE_COLORS[colorIndex];
  if (colorCache.size > 100) colorCache.clear();
  colorCache.set(key, result);
  return result;
};

// Pre-compute dimension cache
let cachedDimensions: { width: number; height: number } | null = null;
let lastScreenW = 0;
const getCardSize = (screenWidth: number) => {
  if (cachedDimensions && lastScreenW === screenWidth) return cachedDimensions;
  lastScreenW = screenWidth;
  cachedDimensions = {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45 * 1.25,
  };
  return cachedDimensions;
};

// Memoized subcomponents with proper typing
const ProBadge = memo(() => (
  <View style={STATIC_STYLES.proBadge}>
    <Ionicons name="diamond" size={12} color="#FFD700" />
    <Text style={STATIC_STYLES.proText}>PRO</Text>
  </View>
));

const DurationBadge = memo(({ duration }: { duration: string }) => (
  <View style={STATIC_STYLES.durationBadge}>
    <Ionicons name="time-outline" size={12} color="white" />
    <Text style={STATIC_STYLES.durationText}>{duration} دقیقه</Text>
  </View>
));

// Fix: ensure category is string (provide fallback)
const CategoryBadge = memo(({ category }: { category: string }) => (
  <View style={STATIC_STYLES.categoryContainer}>
    <Ionicons name="musical-notes" size={12} color="rgba(255,255,255,0.9)" />
    <Text style={STATIC_STYLES.categoryText}>{category}</Text>
  </View>
));

const PlayButton = memo(({ onPress, isLoading, isPlaying, color }: any) => {
  if (isLoading)
    return (
      <View style={STATIC_STYLES.loadingContainer}>
        <Spinner color="#fff" size="small" />
      </View>
    );
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={STATIC_STYLES.playButton}
    >
      {isPlaying ? (
        <Entypo name="controller-paus" size={22} color={color} />
      ) : (
        <Entypo
          name="controller-play"
          size={24}
          color={color}
          style={{ marginLeft: 2 }}
        />
      )}
    </TouchableOpacity>
  );
});

interface CourseCardProps {
  index: number;
  item: Meditation;
}

const CourseCard: React.FC<CourseCardProps> = memo(
  ({ index, item }) => {
    const { loadTrack, track, isPlaying } = useAudioPlayer();
    const [isLoading, setLoading] = useState(false);
    const { data: plans } = usePlansQuery(null);
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const mounted = useRef(true);

    const isProActive =
      plans?.data?.plans?.some((p) => p.name === "unlimited" && p.isActive) ??
      false;
    const colorSet = getColorSet(item.type, index);
    const isCurrentlyPlaying = track?.id === item.id && isPlaying;
    const { width: cardWidth, height: cardHeight } = getCardSize(width);

    const handleOpenNotProModal = useCallback(() => {
      dispatch({
        type: "pro/setShowNotProModal",
        payload: {
          message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
          showNotProModal: true,
        },
      });
    }, [dispatch]);

    const showInterstitial = useCallback(() => {
      if (isProActive) return;
      showAd();
    }, [isProActive]);

    const handlePlay = useCallback(async () => {
      if (isLoading) return;
      setLoading(true);
      try {
        if (item.isPro && !isProActive) return handleOpenNotProModal();
        showInterstitial();
        await loadTrack(item.id);
      } finally {
        if (mounted.current) setLoading(false);
      }
    }, [
      item.id,
      item.isPro,
      isProActive,
      loadTrack,
      handleOpenNotProModal,
      showInterstitial,
      isLoading,
    ]);

    const handleCardPress = useCallback(() => {
      if (item.isPro && !isProActive) return handleOpenNotProModal();
      showInterstitial();
      router.push({ pathname: "/player", params: { id: `${item.id}` } });
    }, [
      item.id,
      item.isPro,
      isProActive,
      handleOpenNotProModal,
      showInterstitial,
    ]);

    React.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    // Fix: ensure category is string with fallback
    const categoryText = typeTopPersian(item.type) ?? "";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCardPress}
        style={{ transform: [{ scale: 1 }] }}
      >
        <View style={{ width: cardWidth, marginHorizontal: 6 }}>
          <LinearGradient
            colors={colorSet.gradient} // Now it's mutable string[]
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[STATIC_STYLES.gradient, { height: cardHeight }]}
          >
            <FastImage
              source={{ uri: BASE_URL_IMAGES + item.image }}
              style={STATIC_STYLES.backgroundImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={STATIC_STYLES.decorativeTop} />
            <View style={STATIC_STYLES.decorativeBottom} />
            {item.isPro && <ProBadge />}
            <View style={STATIC_STYLES.contentContainer}>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <DurationBadge duration={toPersianDigits(item.duration)} />
              </View>
              <View style={STATIC_STYLES.bottomSection}>
                <Text
                  numberOfLines={2}
                  className="font-vazirBold text-right text-white text-lg"
                >
                  {item.title}
                </Text>
                <View style={STATIC_STYLES.rowBetween}>
                  <CategoryBadge category={categoryText} />
                  <PlayButton
                    onPress={handlePlay}
                    isLoading={isLoading}
                    isPlaying={isCurrentlyPlaying}
                    color={colorSet.gradientStart}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.index === next.index &&
    prev.item.title === next.item.title &&
    prev.item.duration === next.item.duration &&
    prev.item.isPro === next.item.isPro
);

export default CourseCard;
