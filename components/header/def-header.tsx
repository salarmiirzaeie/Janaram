import React from "react";
import { Text, View } from "react-native";
import { HStack } from "../ui/hstack";

const DefHeader = ({ title }: { title: string }) => {
  return (
    <HStack className="items-center shadow-xl bg-white py-4 justify-between">
      <View className="w-10 h-10" />

      <Text className=" font-vazirBold text-lg">{title} </Text>

      <View className="w-10 h-10" />
    </HStack>
  );
};

export default DefHeader;
