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
const cardColors = [
  { bg: "bg-secondary-300", btn: "bg-secondary-500" },
  { bg: "bg-primary-300", btn: "bg-primary-500" },
  { bg: "bg-calm-300", btn: "bg-calm-500" },
];

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

  const colorSet = cardColors[index % cardColors.length];

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
      <VStack className={`rounded-3xl shadow-sm h-52 w-48 justify-between p-5 mx-2 ${colorSet.bg}`}>
        <Image
          source={require("@/assets/images/log-vector.png")}
          className="absolute -left-16 right-0 bottom-0 h-[112px] w-52 opacity-40 rounded-3xl"
          resizeMode="cover"
        />
        <Text className="text-xl z-40 text-right font-vazir text-white">
          {item?.title?.length > 25 ? item?.title.slice(0, 25) + "..." : item?.title}
        </Text>
        <HStack className="items-center justify-between">
          <Badge className="rounded-full">
            <BadgeText>{item?.duration} دقیقه</BadgeText>
          </Badge>
          {isLoading ? (
            <View
              style={{
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#999",
                borderRadius: 34,
              }}
            >
              <Spinner color={"#fff"} />
            </View>
          ) : (
            <Pressable
              onPress={handlePlay}
              className={`rounded-full h-14 w-14 justify-center items-center ${colorSet.btn}`}
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
