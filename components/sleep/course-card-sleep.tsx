import { interstitialPlacement } from "@/constants/keys";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { toPersianDigits } from "@/utils/persian";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Adivery } from "adivery";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

interface IVStackProps extends React.ComponentProps<typeof VStack> {
  index: number;
  item: Meditation;
}

const SleepCourseCard: React.FC<IVStackProps> = ({ item, index }) => {
  const { loadTrack, track, isPlaying } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
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
      if (!proPlan?.isActive) {
        Adivery.prepareInterstitialAd(interstitialPlacement);
        Adivery.isLoaded(interstitialPlacement).then((isLoaded) => {
          if (isLoaded) {
            Adivery.showAd(interstitialPlacement);
          }
        });
      }

      await loadTrack(item.id);
    }
    setLoading(false);
  };

  const isCurrentlyPlaying = track?.id === item.id && isPlaying;

  return (
    <Pressable
      onPress={() => {
        if (item.isPro && !proPlan?.isActive) {
          handleOpenNotProModal();
          return;
        }
        if (!proPlan?.isActive) {
          Adivery.prepareInterstitialAd(interstitialPlacement);
          Adivery.isLoaded(interstitialPlacement).then((isLoaded) => {
            if (isLoaded) {
              Adivery.showAd(interstitialPlacement);
            }
          });
        }
        router.push({
          pathname: "/player",
          params: { id: item?.id },
        });
      }}
    >
      <View
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginHorizontal: 8 }}
      >
        {/* Background Image */}
        <Image
          source={{ uri: BASE_URL_IMAGES + item.image }}
          style={{
            position: "absolute",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 24,
          }}
          resizeMode="cover"
        />

        {/* Dark Gradient Overlay for Sleep Mode */}
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.85)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 24,
          }}
        />

        {/* Pro Badge - Dark Mode Style */}
        {item?.isPro && (
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              alignItems: "center",
              zIndex: 10,
              borderWidth: 1,
              borderColor: "rgba(255,215,0,0.3)",
            }}
          >
            <MaterialIcons name="workspace-premium" size={12} color="#FFD700" />
            <Text
              className="font-vazirBold text-white text-xs"
              style={{ marginRight: 4 }}
            >
              Pro
            </Text>
          </View>
        )}

        {/* Duration Badge - Bottom Left */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <MaterialIcons
            name="schedule"
            size={12}
            color="rgba(255,255,255,0.8)"
          />
          <Text
            className="font-vazir text-white text-xs"
            style={{ marginRight: 4 }}
          >
            {toPersianDigits(item?.duration)} دقیقه
          </Text>
        </View>

        {/* Content Container */}
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            padding: 16,
            zIndex: 5,
          }}
        >
          {/* Top Section - Empty for spacing */}
          <View />

          {/* Bottom Section */}
          <VStack style={{ gap: 12 }}>
            {/* Title */}
            <Text
              className="text-white font-vazirBold text-right text-base leading-6"
              numberOfLines={2}
            >
              {item?.title}
            </Text>

            {/* Play Button Row */}
            <HStack className="items-center justify-between">
              {/* Category label */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <MaterialIcons
                  name="nightlight"
                  size={14}
                  color="rgba(255,255,255,0.6)"
                />
                <Text className="text-white/60 font-vazir text-xs">خواب</Text>
              </View>

              {/* Play Button */}
              {isLoading ? (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spinner color={"#fff"} size="small" />
                </View>
              ) : (
                <Pressable
                  onPress={handlePlay}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isCurrentlyPlaying ? (
                    <Entypo name="controller-paus" size={22} color="white" />
                  ) : (
                    <Entypo
                      name="controller-play"
                      size={24}
                      color="white"
                      style={{ marginLeft: 2 }}
                    />
                  )}
                </Pressable>
              )}
            </HStack>
          </VStack>
        </View>

        {/* Subtle Border */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
          }}
          pointerEvents="none"
        />
      </View>
    </Pressable>
  );
};

export default SleepCourseCard;
