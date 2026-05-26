import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { Entypo } from "@expo/vector-icons";
// import { Adivery } from "adivery";
import { usePro } from "@/hooks/usePro";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Text } from "react-native";
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

const MusicCard = React.memo(({ item, isBreathing = false, isPro }: MusicCardProps) => {
  // ✅ Defensive check: if item is undefined/null, render nothing
  if (!item) return null;

  const { track, loadTrack, isPlaying } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
  const { data: plans } = usePlansQuery(null);
  const isCurrentlyPlaying = track?.id === item.id && isPlaying;
  const { handleOpenNotProModal, isProActive, showInterstitial } = usePro();

  const proPlan = useMemo(() => plans?.data.plans?.find((plan) => plan.name === "unlimited"), [plans?.data.plans]);

  const isProAndNotActive = isPro && !proPlan?.isActive;

  const handlePlay = useCallback(async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      if (item.id) {
        if (item.isPro && !proPlan?.isActive) {
          handleOpenNotProModal();
          return;
        }
        // if (!proPlan?.isActive) {
        //   showAd();
        // }
        await loadTrack(item.id);
      }
    } finally {
      setLoading(false);
    }
  }, [item.id, isProAndNotActive, loadTrack, handleOpenNotProModal, isLoading]);
  const handleCardPress = useCallback(() => {
    if (isPro && !proPlan?.isActive) {
      handleOpenNotProModal();
      return;
    }
    // if (!proPlan?.isActive) {
    //   showAd();
    // }
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
          <Image source={{ uri: item.image2 }} style={{ width: 48, height: 48, borderRadius: 8 }} resizeMode="cover" />
        )}
        <VStack className="flex-1 ml-3">
          <Text className="font-vazirBold text-right text-base">{item.title}</Text>
        </VStack>
        <HStack space="md" className="items-center space-x-2">
          <Text className="text-xs text-muted-foreground">{item.duration}</Text>
          {!isBreathing &&
            (isLoading ? (
              <Spinner />
            ) : (
              <Pressable onPress={handlePlay}>
                {isCurrentlyPlaying ? (
                  <Entypo name="controller-paus" size={22} color={"#000"} />
                ) : (
                  <Entypo name="controller-play" size={24} color={"#000"} style={{ marginLeft: 2 }} />
                )}
              </Pressable>
            ))}
        </HStack>
      </HStack>
    </Pressable>
  );
});

export default MusicCard;
