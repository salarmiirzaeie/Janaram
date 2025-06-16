import { Track, useAudioPlayer } from "@/context/AudioPlayerContext";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, View } from "react-native";
import { Badge, BadgeText } from "../ui/badge";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
export interface IMusic {
  id: number;
  title: string;
  artist: string;
  image: string;
  duration: string;
}
interface IVStackProps extends React.ComponentProps<typeof VStack> {
  item: IMusic;
  isSleepMusic?: boolean;
}
const SleepCourseCard: React.FC<IVStackProps> = ({ item, isSleepMusic }) => {
  const track: Track = {
    id: `sleep/${item.id}`,
    title: item.title || "Unknown Title",
    artist: item.artist || "Unknown Artist",
    image: item.image, // در صورت نیاز
  };
  const { loadTrack } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    await loadTrack(track);
    setLoading(false);
  };
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/player",
          params: { id: `sleep/${item.id}`, title: item.title, artist: item.artist, image: item.image },
        })
      }
    >
      <VStack
        className={`rounded-3xl h-52 w-48 justify-between p-5  mx-2 bg-background-800
        `}
      >
        <Image
          source={{
            uri: !isSleepMusic
              ? item.image
              : "https://www.dreams.co.uk/sleep-matters-club/wp-content/uploads/mike-petrucci-uIf6H1or1nE-unsplash-1000x751.jpg",
          }}
          className="absolute top-0 left-0 right-0 bottom-0 h-52 w-48 opacity-50 rounded-3xl"
          resizeMode="cover"
        />
        <Text className="color-white text-2xl z-40 text-right font-semiBold">
          {item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title}
        </Text>
        <HStack className="items-center justify-between">
          <Badge className="rounded-full">
            <BadgeText className="font-medium">{item.duration}</BadgeText>
          </Badge>
          {isLoading ? (
            <View
              style={{
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "gray",
                borderRadius: 34,
              }}
            >
              <Spinner color={"#fff"} />
            </View>
          ) : (
            <Pressable
              onPress={() => handlePlay()}
              className={`rounded-full h-14 w-14 justify-center items-center bg-background-600 `}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          )}
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default SleepCourseCard;
