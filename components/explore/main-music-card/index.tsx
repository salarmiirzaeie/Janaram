import { usePro } from "@/hooks/usePro";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { toPersianDigits, typeTopPersian } from "@/utils/persian";
import { router } from "expo-router";
import React, { FC, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import CategoryBadge from "./category-badge";
import DurationBadge from "./duration-badge";
import PlayButton from "./play-button";
import ProBadge from "./pro-badge";
import { getColorSet } from "./utils/color";
interface IProps {
  item: any;
  index: number;
}
const MusicMainCard: FC<IProps> = ({ item, index }) => {
  const { handleOpenNotProModal, isProActive, showInterstitial } = usePro();
  const categoryText = typeTopPersian(item.type) ?? "";

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
  const colorSet = getColorSet(item.type, index);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleCardPress}>
      <View className="w-48 mx-3">
        <LinearGradient
          colors={colorSet.gradient} // Now it's mutable string[]
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
            source={{ uri: BASE_URL_IMAGES + item.image }}
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
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <DurationBadge duration={toPersianDigits(item.duration)} />
            </View>
            <View style={{ gap: 12 }}>
              <Text
                numberOfLines={2}
                className="font-vazirBold text-right text-white text-lg"
              >
                {item.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <CategoryBadge category={categoryText} />
                <PlayButton item={item} color={colorSet.gradientStart} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default MusicMainCard;
