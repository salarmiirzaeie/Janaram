import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { Entypo } from "@expo/vector-icons";
// import { Adivery } from "adivery";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Badge, BadgeText } from "../ui/badge";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";

const MusicCard = ({ item }: { item: Meditation }) => {
  const { track: currentTrack, loadTrack, isPlaying } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const dispatch = useDispatch();
  const isCurrentlyPlaying = currentTrack?.id === item.id && isPlaying;

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
        return;
      }
      if (!proPlan?.isActive) {
        // Adivery.prepareInterstitialAd(interstitialPlacement);
        // Adivery.isLoaded(interstitialPlacement).then((isLoaded) => {
        //   if (isLoaded) {
        //     Adivery.showAd(interstitialPlacement);
        //   }
        // });
      }
      await loadTrack(item.id);
    }
    setLoading(false);
  };
  return (
    <Pressable
      key={item.id}
      className="rounded-2xl bg-background-800 px-4 h-20 items-center mb-3 active:opacity-70"
      onPress={() => {
        if (item.isPro && !proPlan?.isActive) {
          handleOpenNotProModal();
          return;
        }
        if (!proPlan?.isActive) {
          // Adivery.prepareInterstitialAd(interstitialPlacement);
          // Adivery.isLoaded(interstitialPlacement).then((isLoaded) => {
          //   if (isLoaded) {
          //     Adivery.showAd(interstitialPlacement);
          //   }
          // });
        }
        router.push({
          pathname: "/player",
          params: { id: item.id },
        });
      }}
    >
      {item?.isPro && (
        <Badge className={`absolute right-10 bg-white z-50 rounded-b-xl top-0`}>
          <BadgeText className="font-vazir text-text">{"Pro"}</BadgeText>
        </Badge>
      )}
      <HStack space="md" className="items-center justify-between flex-1">
        {/* Optional thumbnail if available */}
        {item.image && (
          <Image
            source={{ uri: BASE_URL_IMAGES + item.image }}
            style={{ width: 48, height: 48, borderRadius: 8 }}
            resizeMode="cover"
          />
        )}
        <VStack className="flex-1 ml-3">
          <Text className="font-vazirBold text-white  text-base">
            {item.title}
          </Text>
          {/* <Text className="text-muted-foreground text-white font-thin text-sm">
            {item.description.slice(0, 60)}
          </Text> */}
        </VStack>
        <HStack space="md" className="items-center space-x-2">
          <Text className="text-xs text-muted-foreground text-white">
            {item.duration}
          </Text>
          {isLoading ? (
            <Spinner />
          ) : (
            <Pressable
              onPress={() => {
                handlePlay();
              }}
            >
              {isCurrentlyPlaying ? (
                <Entypo name="controller-paus" size={22} color={"#FFFF"} />
              ) : (
                <Entypo
                  name="controller-play"
                  size={24}
                  color={"#FFFF"}
                  style={{ marginLeft: 2 }}
                />
              )}
            </Pressable>
          )}
        </HStack>
      </HStack>
    </Pressable>
  );
};

export default MusicCard;
