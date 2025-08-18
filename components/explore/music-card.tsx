import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { useGetMeditationQuery } from "@/services/meditations/meditation-adapter";
import { Meditation } from "@/types";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text } from "react-native";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";

const MusicCard = ({ item }: { item: Meditation }) => {
  const { track: currentTrack, loadTrack } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
  const { data } = useGetMeditationQuery({ id: item?.id });

  const handlePlay = async () => {
    setLoading(true);
    if (data?.meditation) {
      await loadTrack(data?.meditation);
    }
    setLoading(false);
  };
  return (
    <Pressable
      key={item.id}
      className="rounded-2xl bg-white shadow-md px-4 h-20 items-center mb-3 active:opacity-70"
      onPress={() => {
        router.push({
          pathname: "/player",
          params: {
            id: `${item.id}`,
          },
        });
      }}
    >
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
          <Text className="font-semiBold text-right text-base">{item.title}</Text>
        </VStack>
        <HStack space="md" className="items-center space-x-2">
          <Text className="text-xs text-muted-foreground">{item.duration}</Text>
          {isLoading ? (
            <Spinner />
          ) : (
            <Pressable
              onPress={() => {
                handlePlay();
              }}
            >
              <Entypo name="controller-play" size={24} color="black" />
            </Pressable>
          )}
        </HStack>
      </HStack>
    </Pressable>
  );
};

export default MusicCard;
