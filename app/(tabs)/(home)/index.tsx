import CourseCard from "@/components/home/course-card";
import MoodCard from "@/components/home/mood-card";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import data from "@/database/recommends.json";
import React from "react";
import { ScrollView } from "react-native";

const index = () => {
  return (
    <ScrollView className="flex-1 bg-white ">
      <VStack className="flex-1   bg-white mb-20">
        <VStack className="w-full items-center  justify-center px-5 py-2">
          <MoodCard />
        </VStack>

        <VStack space="md" className="mt-5 px-5">
          <HStack className="items-center justify-between">
            <Text className="text-typography-400 text-sm"> </Text>
            <Text className="text-typography-700 text-lg font-semiBold"> چت بات جانارام </Text>
          </HStack>

          <TestCard />
        </VStack>
        <VStack space="lg" className="mt-2">
          <HStack className="items-center justify-between mx-5">
            <Text className="text-typography-400 text-sm"> </Text>

            <Text className="text-lg font-semiBold">پیشنهاد ها برای شما</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {data
              .sort((a, b) => b.id - a.id)
              .map((item, index) => (
                <CourseCard type={1} item={item} index={index} key={item.id} />
              ))}
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default index;
