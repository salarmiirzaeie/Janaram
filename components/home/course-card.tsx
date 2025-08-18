import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { Meditation } from "@/types";
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
interface IVStackProps extends React.ComponentProps<typeof VStack> {
  index: number;
  item: Meditation;
}
const CourseCard: React.FC<IVStackProps> = ({ index, item }) => {
  const { loadTrack, track } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    if (item.id) {
      await loadTrack(item.id);
    }
    setLoading(false);
  };
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/player",
          params: {
            id: `${item?.id}`,
          },
        })
      }
    >
      <VStack
        className={`rounded-3xl h-52 w-48 justify-between p-5  mx-2 ${
          index % 3 === 0 ? "bg-purple-300" : index % 3 === 1 ? "bg-blue-300" : "bg-pink-300"
        }`}
      >
        <Image
          source={require("@/assets/images/log-vector.png")}
          className="absolute  -left-16 right-0 bottom-0 h-[112px] w-52 opacity-50 rounded-3xl"
          resizeMode="cover"
        />
        <Text className="color-white text-2xl z-40 text-right font-semiBold">
          {item?.title?.length > 25 ? item?.title.slice(0, 25) + "..." : item?.title}
        </Text>
        <HStack className="items-center justify-between">
          <Badge className="rounded-full">
            <BadgeText>{item?.duration}</BadgeText>
          </Badge>
          {isLoading ? (
            <View
              style={{
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: index % 3 === 0 ? "#8b5cf6" : index % 3 === 1 ? "#3b82f6" : "#ec4899",
                borderRadius: 34,
              }}
            >
              <Spinner color={"#fff"} />
            </View>
          ) : (
            <Pressable
              onPress={handlePlay}
              className={`rounded-full h-14 w-14 justify-center items-center ${
                index % 3 === 0 ? "bg-purple-500" : index % 3 === 1 ? "bg-blue-500" : "bg-pink-500"
              } `}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          )}
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default CourseCard;
