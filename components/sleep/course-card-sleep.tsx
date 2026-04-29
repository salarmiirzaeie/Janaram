import { BASE_URL_IMAGES } from "@/redux/api-slice";
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
  const { handleOpenNotProModal, isProActive, showInterstitial } = usePro();

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
  return (
    // <Pressable
    //   onPress={() => {
    //     if (item.isPro && !proPlan?.isActive) {
    //       handleOpenNotProModal();
    //       return;
    //     }
    //     if (!proPlan?.isActive) {
    //       showAd();
    //     }
    //     router.push({
    //       pathname: "/player",
    //       params: { id: item?.id },
    //     });
    //   }}
    // >
    //   <View
    //     style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginHorizontal: 8 }}
    //   >
    //     {/* Background Image */}
    //     <Image
    //       source={{ uri: BASE_URL_IMAGES + item.image }}
    //       style={{
    //         position: "absolute",
    //         width: CARD_WIDTH,
    //         height: CARD_HEIGHT,
    //         borderRadius: 24,
    //       }}
    //       resizeMode="cover"
    //     />

    //     {/* Dark Gradient Overlay for Sleep Mode */}
    //     <LinearGradient
    //       colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.85)"]}
    //       start={{ x: 0, y: 0 }}
    //       end={{ x: 1, y: 1 }}
    //       style={{
    //         position: "absolute",
    //         width: CARD_WIDTH,
    //         height: CARD_HEIGHT,
    //         borderRadius: 24,
    //       }}
    //     />

    //     {/* Pro Badge - Dark Mode Style */}
    //     {item?.isPro && (
    //       <View
    //         style={{
    //           position: "absolute",
    //           top: 12,
    //           right: 12,
    //           backgroundColor: "rgba(0,0,0,0.6)",
    //           borderRadius: 12,
    //           paddingHorizontal: 10,
    //           paddingVertical: 5,
    //           flexDirection: "row",
    //           alignItems: "center",
    //           zIndex: 10,
    //           borderWidth: 1,
    //           borderColor: "rgba(255,215,0,0.3)",
    //         }}
    //       >
    //         <MaterialIcons name="workspace-premium" size={12} color="#FFD700" />
    //         <Text
    //           className="font-vazirBold text-white text-xs"
    //           style={{ marginRight: 4 }}
    //         >
    //           Pro
    //         </Text>
    //       </View>
    //     )}

    //     {/* Duration Badge - Bottom Left */}
    //     <View
    //       style={{
    //         position: "absolute",
    //         top: 12,
    //         left: 12,
    //         backgroundColor: "rgba(0,0,0,0.5)",
    //         borderRadius: 20,
    //         paddingHorizontal: 10,
    //         paddingVertical: 5,
    //         flexDirection: "row",
    //         alignItems: "center",
    //         zIndex: 10,
    //       }}
    //     >
    //       <MaterialIcons
    //         name="schedule"
    //         size={12}
    //         color="rgba(255,255,255,0.8)"
    //       />
    //       <Text
    //         className="font-vazir text-white text-xs"
    //         style={{ marginRight: 4 }}
    //       >
    //         {toPersianDigits(item?.duration)} دقیقه
    //       </Text>
    //     </View>

    //     {/* Content Container */}
    //     <View
    //       style={{
    //         flex: 1,
    //         justifyContent: "space-between",
    //         padding: 16,
    //         zIndex: 5,
    //       }}
    //     >
    //       {/* Top Section - Empty for spacing */}
    //       <View />

    //       {/* Bottom Section */}
    //       <VStack style={{ gap: 12 }}>
    //         {/* Title */}
    //         <Text
    //           className="text-white font-vazirBold text-right text-base leading-6"
    //           numberOfLines={2}
    //         >
    //           {item?.title}
    //         </Text>

    //         {/* Play Button Row */}
    //         <HStack className="items-center justify-between">
    //           {/* Category label */}
    //           <View
    //             style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
    //           >
    //             <MaterialIcons
    //               name="nightlight"
    //               size={14}
    //               color="rgba(255,255,255,0.6)"
    //             />
    //             <Text className="text-white/60 font-vazir text-xs">خواب</Text>
    //           </View>

    //           {/* Play Button */}
    //           {isLoading ? (
    //             <View
    //               style={{
    //                 width: 48,
    //                 height: 48,
    //                 borderRadius: 24,
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //               }}
    //             >
    //               <Spinner color={"#fff"} size="small" />
    //             </View>
    //           ) : (
    //             <Pressable
    //               onPress={handlePlay}
    //               style={{
    //                 width: 48,
    //                 height: 48,
    //                 borderRadius: 24,
    //                 backgroundColor: "rgba(255,255,255,0.2)",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //               }}
    //             >
    //               {isCurrentlyPlaying ? (
    //                 <Entypo name="controller-paus" size={22} color="white" />
    //               ) : (
    //                 <Entypo
    //                   name="controller-play"
    //                   size={24}
    //                   color="white"
    //                   style={{ marginLeft: 2 }}
    //                 />
    //               )}
    //             </Pressable>
    //           )}
    //         </HStack>
    //       </VStack>
    //     </View>

    //     {/* Subtle Border */}
    //     <View
    //       style={{
    //         position: "absolute",
    //         top: 0,
    //         left: 0,
    //         right: 0,
    //         bottom: 0,
    //         borderRadius: 24,
    //         borderWidth: 1,
    //         borderColor: "rgba(255,255,255,0.1)",
    //       }}
    //       pointerEvents="none"
    //     />
    //   </View>
    // </Pressable>

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
