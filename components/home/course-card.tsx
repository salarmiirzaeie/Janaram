import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { toPersianDigits } from "@/utils/persian";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

interface CourseCardProps {
  index: number;
  item: Meditation;
}

const cardColors = [
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

const CourseCard: React.FC<CourseCardProps> = ({ index, item }) => {
  const { loadTrack, track } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const dispatch = useDispatch();

  const handleOpenNotProModal = () => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
        showNotProModal: true,
      },
    });
  };

  const handlePlay = async () => {
    setLoading(true);
    if (item.id) {
      if (item.isPro && !proPlan?.isActive) {
        handleOpenNotProModal();
        setLoading(false);
        return;
      }
      await loadTrack(item.id);
    }
    setLoading(false);
  };

  const colorSet = cardColors[index % cardColors.length];
  const isCurrentlyPlaying = track?.id === item.id;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (item.isPro && !proPlan?.isActive) {
          handleOpenNotProModal();
          return;
        }
        router.push({
          pathname: "/player",
          params: { id: `${item?.id}` },
        });
      }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        transform: [{ scale: isPressed ? 0.97 : 1 }],
      }}
    >
      <View style={{ width: CARD_WIDTH, marginHorizontal: 6 }}>
        {/* Card Container */}
        <LinearGradient
          colors={colorSet.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            overflow: "hidden",
            height: CARD_HEIGHT,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {/* Background Pattern / Image */}
          <Image
            source={{ uri: BASE_URL_IMAGES + item.image }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.12,
            }}
            resizeMode="cover"
          />

          {/* Decorative Elements */}
          <View
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />

          {/* Pro Badge */}
          {item?.isPro && (
            <View
              style={{
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
              }}
            >
              <Ionicons name="diamond" size={12} color="#FFD700" />
              <Text
                style={{
                  color: "#FFD700",
                  fontSize: 10,
                  fontWeight: "bold",
                  fontFamily: "vazir",
                }}
              >
                PRO
              </Text>
            </View>
          )}

          {/* Content */}
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              padding: 16,
              paddingTop: 20,
            }}
          >
            {/* Top Section - Duration */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Ionicons name="time-outline" size={12} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 11,
                    fontWeight: "500",
                    fontFamily: "vazir",
                  }}
                >
                  {toPersianDigits(item?.duration)} دقیقه
                </Text>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={{ gap: 12 }}>
              {/* Title */}
              <Text
                numberOfLines={2}
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "right",
                  lineHeight: 22,
                  textShadowColor: "rgba(0,0,0,0.15)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                  fontFamily: "vazir",
                }}
              >
                {item?.title}
              </Text>

              {/* Play Button and Category */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Ionicons
                    name="musical-notes"
                    size={12}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 10,
                      fontWeight: "500",
                      fontFamily: "vazir",
                    }}
                  >
                    {item.type}
                  </Text>
                </View>

                {isLoading ? (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spinner color={"#fff"} size="small" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePlay}
                    activeOpacity={0.8}
                    style={{
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
                    }}
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
};

export default CourseCard;
