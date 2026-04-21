import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Badge, BadgeText } from "../ui/badge";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";

interface MusicCardProps {
  item: Meditation;
  isBreathing?: boolean;
  isPro: boolean;
}

const MusicCard = React.memo(
  ({ item, isBreathing = false, isPro }: MusicCardProps) => {
    // ✅ Defensive check: if item is undefined/null, render nothing
    if (!item) return null;

    const { track, loadTrack } = useAudioPlayer();
    const [isLoading, setLoading] = useState(false);
    const { data: plans } = usePlansQuery(null);
    const dispatch = useDispatch();

    const proPlan = useMemo(
      () => plans?.data.plans?.find((plan) => plan.name === "unlimited"),
      [plans?.data.plans]
    );

    const isProAndNotActive = isPro && !proPlan?.isActive;

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
      if (isLoading) return;
      setLoading(true);
      try {
        if (item.id) {
          if (isProAndNotActive) {
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
      isProAndNotActive,
      loadTrack,
      handleOpenNotProModal,
      isLoading,
    ]);

    const handleCardPress = useCallback(() => {
      if (isProAndNotActive) {
        handleOpenNotProModal();
        return;
      }
      router.push({
        pathname: isBreathing ? "/breathingPlayer" : "/player",
        params: { id: `${item.id}` },
      });
    }, [isProAndNotActive, handleOpenNotProModal, isBreathing, item.id]);

    return (
      <Pressable
        key={item.id}
        className="rounded-2xl bg-white shadow-sm px-4 h-20 items-center mb-3 active:opacity-70"
        onPress={handleCardPress}
      >
        {isPro && (
          <Badge className="absolute right-10 bg-black z-50 rounded-b-xl top-0">
            <BadgeText className="font-vazir text-white">Pro</BadgeText>
          </Badge>
        )}
        <HStack space="md" className="items-center justify-between flex-1">
          {item.image && (
            <Image
              source={{ uri: BASE_URL_IMAGES + item.image }}
              style={{ width: 48, height: 48, borderRadius: 8 }}
              resizeMode="cover"
            />
          )}
          <VStack className="flex-1 ml-3">
            <Text className="font-vazirBold text-right text-base">
              {item.title}
            </Text>
          </VStack>
          <HStack space="md" className="items-center space-x-2">
            <Text className="text-xs text-muted-foreground">
              {item.duration}
            </Text>
            {!isBreathing &&
              (isLoading ? (
                <Spinner />
              ) : (
                <Pressable onPress={handlePlay}>
                  <Entypo name="controller-play" size={24} color="black" />
                </Pressable>
              ))}
          </HStack>
        </HStack>
      </Pressable>
    );
  }
);

export default MusicCard;
