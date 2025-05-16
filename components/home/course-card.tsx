import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Badge, BadgeText } from "../ui/badge";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
interface IVStackProps extends React.ComponentProps<typeof VStack> {
  index: number;
}
const CourseCard: React.FC<IVStackProps> = (props) => {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/player", params: { id: "1" } })}
    >
      <VStack
        className={`rounded-3xl h-52 w-48 justify-between p-5  mx-2 ${
          props.index % 2 ? "bg-purple-300" : "bg-blue-300"
        }`}
      >
        <Text className="color-white text-2xl z-40 text-right font-normal">
          اسکن بدن و برنامه ریزی
        </Text>
        <HStack className="items-center justify-between">
          <Badge className="rounded-full">
            <BadgeText>3دقیقه</BadgeText>
          </Badge>
          <Pressable
            className={`rounded-full h-14 w-14 justify-center items-center ${
              props.index % 2 ? "bg-purple-500" : "bg-blue-500"
            } `}
          >
            <Entypo name="controller-play" size={24} color="white" />
          </Pressable>
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default CourseCard;
