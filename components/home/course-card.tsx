import React from "react";
import { Image, Text } from "react-native";
import { VStack } from "../ui/vstack";

const CourseCard = () => {
  return (
    <VStack className="rounded-2xl h-64 w-52 mx-2 bg-gray-100">
      <Image
        source={require("@/assets/images/med.png")}
        className="h-4/6 w-full rounded-t-2xl"
        alt="image"
      />
      <VStack className="p-4">
        <Text>مدیتیشن روزانه</Text>
      </VStack>
    </VStack>
  );
};

export default CourseCard;
