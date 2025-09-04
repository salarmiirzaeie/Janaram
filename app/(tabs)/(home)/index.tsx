import MoodCard from "@/components/home/mood-card";
import Recommends from "@/components/home/recommends";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";

const index = () => {
  return (
    <ScrollView className="flex-1 bg-white ">
      <VStack className="flex-1   bg-white  mb-20">
        <VStack className="w-full items-center  justify-center px-5 py-2">
          <MoodCard />
        </VStack>

        <VStack space="md" className="my-5 px-5">
          <HStack className="items-center justify-between">
            <Text className="text-typography-400 text-sm"> </Text>
            <Text className="font-vazirBold text-xl"> روانشناس من </Text>
          </HStack>

          <TestCard />
        </VStack>
        <VStack space="lg" className="mt-2">
          <HStack className="items-center justify-between mx-5">
            <Text className="text-typography-400 text-sm"> </Text>
            <Text className="font-vazirBold text-xl">پیشنهاد ها برای شما</Text>
          </HStack>
          <Recommends />
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default React.memo(index);
