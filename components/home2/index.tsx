import LessonButton from "@/components/home/LessonButton";
import { FavouriteIcon, PhoneIcon, StarIcon } from "@/components/ui/icon";
import React from "react";
import { FlexAlignType, ScrollView, StatusBar, View } from "react-native";

const index = () => {
  const alignTypes: FlexAlignType[] = ["flex-start", "center", "flex-end"];

  const lessons: {
    id: number;
    status: "complete" | "incomplete" | "progress";
    icon?: any;
  }[] = [
    { id: 1, status: "complete", icon: StarIcon },
    { id: 2, status: "complete", icon: PhoneIcon },
    { id: 3, status: "complete", icon: StarIcon },
    { id: 4, status: "progress", icon: FavouriteIcon },
    { id: 5, status: "incomplete", icon: StarIcon },
    { id: 6, status: "incomplete", icon: PhoneIcon },
    { id: 7, status: "incomplete", icon: StarIcon },
    { id: 8, status: "incomplete", icon: StarIcon },
  ];

  function customSequence(n: number) {
    const values = [0, 1, 2, 1];
    return values[n % values.length];
  }
  return (
    <ScrollView className="flex-1 bg-background-100">
      <StatusBar backgroundColor={"#fff"} />
      <View className="p-4 justify-between">
        {lessons.map((item, index) => {
          const alignSelfType = alignTypes[customSequence(index)];

          return (
            <LessonButton
              icon={item.icon}
              status={item.status}
              key={item.id}
              onPress={() => {}}
              alignSelf={alignSelfType}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default index;
