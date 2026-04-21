import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { toPersianDigits, typeTopPersian } from "@/utils/persian";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";

// استایل‌های استاتیک (بدون مقادیر وابسته به عرض صفحه)
const STATIC_STYLES = StyleSheet.create({
  container: {
    marginHorizontal: 6,
  },
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
    opacity: 0.12,
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: "vazir",
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
  bottomSection: {
    gap: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});

// آرایه رنگ‌ها (استاتیک خارج از کامپوننت)
const CARD_COLORS = [
  {
    gradient: ["#79AED6", "#5E95BD"],
    gradientStart: "#79AED6",
    gradientEnd: "#5E95BD",
    accent: "#A5C9E1",
    textColor: "#FFFFFF",
  },
  {
    gradient: ["#9966CC", "#804DB3"],
    gradientStart: "#9966CC",
    gradientEnd: "#804DB3",
    accent: "#C2A3E1",
    textColor: "#FFFFFF",
  },
  {
    gradient: ["#FF9966", "#E6804D"],
    gradientStart: "#FF9966",
    gradientEnd: "#E6804D",
    accent: "#FFC2A3",
    textColor: "#FFFFFF",
  },
  {
    gradient: ["#91A5BE", "#7A8BA8"],
    gradientStart: "#91A5BE",
    gradientEnd: "#7A8BA8",
    accent: "#BDC9D8",
    textColor: "#FFFFFF",
  },
  {
    gradient: ["#79AED6", "#9966CC"],
    gradientStart: "#79AED6",
    gradientEnd: "#9966CC",
    accent: "#D6C2EB",
    textColor: "#FFFFFF",
  },
  {
    gradient: ["#FF9966", "#9966CC"],
    gradientStart: "#FF9966",
    gradientEnd: "#9966CC",
    accent: "#FFD6C2",
    textColor: "#FFFFFF",
  },
];

interface CourseCardProps {
  index: number;
  item: Meditation;
}

const CourseCard: React.FC<CourseCardProps> = React.memo(({ index, item }) => {
  const { loadTrack, track } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { data: plans } = usePlansQuery(null);
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();

  // محاسبه ابعاد کارت بر اساس عرض صفحه (پاسخگو به تغییر جهت)
  const cardDimensions = useMemo(() => {
    const CARD_WIDTH = screenWidth * 0.45;
    const CARD_HEIGHT = CARD_WIDTH * 1.25;
    return { CARD_WIDTH, CARD_HEIGHT };
  }, [screenWidth]);

  // استایل‌های داینامیک (وابسته به ابعاد)
  const dynamicStyles = useMemo(() => {
    const { CARD_WIDTH, CARD_HEIGHT } = cardDimensions;
    return StyleSheet.create({
      container: {
        width: CARD_WIDTH,
        marginHorizontal: 6,
      },
      gradient: {
        height: CARD_HEIGHT,
      },
    });
  }, [cardDimensions]);

  const proPlan = useMemo(
    () => plans?.data.plans?.find((plan) => plan.name === "unlimited"),
    [plans?.data.plans]
  );

  const colorSet = CARD_COLORS[index % CARD_COLORS.length];
  const isCurrentlyPlaying = track?.id === item.id;

  const handleOpenNotProModal = useCallback(() => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
        showNotProModal: true,
      },
    });
  }, [dispatch]);

  const handlePlay = useCallback(async () => {
    if (isLoading) return; // prevent double tap
    setLoading(true);
    try {
      if (item.id) {
        if (item.isPro && !proPlan?.isActive) {
          handleOpenNotProModal();
          return;
        }
        await loadTrack(item.id);
      }
    } finally {
      setLoading(false);
    }
  }, [
    item.id,
    item.isPro,
    proPlan?.isActive,
    loadTrack,
    handleOpenNotProModal,
    isLoading,
  ]);

  const handleCardPress = useCallback(() => {
    if (item.isPro && !proPlan?.isActive) {
      handleOpenNotProModal();
      return;
    }
    router.push({
      pathname: "/player",
      params: { id: `${item?.id}` },
    });
  }, [item.id, item.isPro, proPlan?.isActive, handleOpenNotProModal]);

  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  // Transform style for press animation
  const transformStyle = useMemo(
    () => ({
      transform: [{ scale: isPressed ? 0.97 : 1 }],
    }),
    [isPressed]
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={transformStyle}
    >
      <View style={[dynamicStyles.container, STATIC_STYLES.container]}>
        <LinearGradient
          colors={colorSet.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[STATIC_STYLES.gradient, dynamicStyles.gradient]}
        >
          <Image
            source={{ uri: BASE_URL_IMAGES + item.image }}
            style={STATIC_STYLES.backgroundImage}
            resizeMode="cover"
          />

          <View style={STATIC_STYLES.decorativeTop} />
          <View style={STATIC_STYLES.decorativeBottom} />

          {item?.isPro && (
            <View style={STATIC_STYLES.proBadge}>
              <Ionicons name="diamond" size={12} color="#FFD700" />
              <Text style={STATIC_STYLES.proText}>PRO</Text>
            </View>
          )}

          <View style={STATIC_STYLES.contentContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <View style={STATIC_STYLES.durationBadge}>
                <Ionicons name="time-outline" size={12} color="white" />
                <Text style={STATIC_STYLES.durationText}>
                  {toPersianDigits(item?.duration)} دقیقه
                </Text>
              </View>
            </View>

            <View style={STATIC_STYLES.bottomSection}>
              <Text numberOfLines={2} style={STATIC_STYLES.title}>
                {item?.title}
              </Text>

              <View style={STATIC_STYLES.rowBetween}>
                <View style={STATIC_STYLES.categoryContainer}>
                  <Ionicons
                    name="musical-notes"
                    size={12}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text style={STATIC_STYLES.categoryText}>
                    {typeTopPersian(item.type)}
                  </Text>
                </View>

                {isLoading ? (
                  <View style={STATIC_STYLES.loadingContainer}>
                    <Spinner color="#fff" size="small" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePlay}
                    activeOpacity={0.8}
                    style={STATIC_STYLES.playButton}
                  >
                    {isCurrentlyPlaying ? (
                      <Entypo
                        name="controller-paus"
                        size={22}
                        color={colorSet.gradientStart}
                      />
                    ) : (
                      <Entypo
                        name="controller-play"
                        size={24}
                        color={colorSet.gradientStart}
                        style={{ marginLeft: 2 }}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
});

export default CourseCard;
