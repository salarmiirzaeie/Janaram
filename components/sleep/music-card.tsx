import { Track, useAudioPlayer } from "@/context/AudioPlayerContext";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text } from "react-native";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { VStack } from "../ui/vstack";
import { IMusic } from "./course-card-sleep";

const MusicCard = ({ item }: { item: IMusic }) => {
  const track: Track = {
    id: `/sleep/${item.id}`,
    title: item.title || "Unknown Title",
    artist: item.artist || "Unknown Artist",
    image: item.image, // در صورت نیاز
  };
  const { track: currentTrack, isPlaying, position, duration, loadTrack, togglePlay, seek } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    await loadTrack(track);
    setLoading(false);
  };
  return (
    <Pressable
      key={item.id}
      className="rounded-2xl bg-background-800 px-4 h-20 items-center mb-3 active:opacity-70"
      onPress={() => {
        router.push({
          pathname: "/player",
          params: { id: `/sleep/${item.id}`, title: item.title, artist: item.artist, image: item.image },
        });
      }}
    >
      <HStack space="md" className="items-center justify-between flex-1">
        {/* Optional thumbnail if available */}
        {item.image && (
          <Image source={{ uri: item.image }} style={{ width: 48, height: 48, borderRadius: 8 }} resizeMode="cover" />
        )}
        <VStack className="flex-1 ml-3">
          <Text className="font-semiBold text-white  text-base">{item.title}</Text>
          <Text className="text-muted-foreground text-white font-thin text-sm">{item.artist}</Text>
        </VStack>
        <HStack space="md" className="items-center space-x-2">
          <Text className="text-xs text-muted-foreground text-white">{item.duration}</Text>
          <Pressable
            onPress={() => {
              handlePlay();
            }}
          >
            <Entypo name="controller-play" size={24} color="white" />
          </Pressable>
        </HStack>
      </HStack>
    </Pressable>
  );
};

export default MusicCard;
