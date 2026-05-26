import { Meditation } from "@/types";
import { toPersianDigits } from "@/utils/persian";
// import { Adivery } from "adivery";
import { usePro } from "@/hooks/usePro";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "react-native-linear-gradient";
import CategoryBadge from "../explore/main-music-card/category-badge";
import DurationBadge from "../explore/main-music-card/duration-badge";
import PlayButton from "../explore/main-music-card/play-button";
import ProBadge from "../explore/main-music-card/pro-badge";
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
  const { handleOpenNotProModal, isProActive } = usePro();

  const handleCardPress = useCallback(() => {
    if (item.isPro && !isProActive) return handleOpenNotProModal();
    // showInterstitial();
    router.push({ pathname: "/player", params: { id: `${item.id}` } });
  }, [
    item.id,
    item.isPro,
    isProActive,
    handleOpenNotProModal,
    // showInterstitial,
  ]);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleCardPress}>
      <View className="w-48 mx-3">
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.85)"]} // Now it's mutable string[]
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
              height: 230,
            },
          ]}
        >
          <FastImage
            source={{ uri: item.image2 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.15,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
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
          {item.isPro && <ProBadge />}
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              padding: 16,
              paddingTop: 13,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <DurationBadge duration={toPersianDigits(item.duration)} />
            </View>
            <View style={{ gap: 12 }}>
              <Text numberOfLines={2} className="font-vazirBold text-right text-white text-lg">
                {item.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <CategoryBadge category={"خواب"} />
                <PlayButton item={item} color={"#000"} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default SleepCourseCard;
