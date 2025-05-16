import CourseCard from "@/components/home/course-card";
import MoodCard from "@/components/home/mood-card";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";

const index = () => {
  return (
    <ScrollView>
      <VStack className="flex-1  py-4 bg-white">
        <VStack className="w-full items-center  justify-center p-5">
          <MoodCard />
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between mx-5">
            <Text className="text-typography-400 text-sm">مشاهده همه</Text>

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
            {[1, 2, 3, 4, 5].map((item, index) => (
              <CourseCard index={index} key={item} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="md" className="mt-6 px-5">
          <HStack className="items-center justify-between">
            <Text className="text-typography-400 text-sm">مشاهده همه</Text>
            <Text className="text-typography-700 text-lg font-semiBold">
              مدیتیشن های جدید
            </Text>
          </HStack>

          {[1, 2, 3, 4].map((item) => (
            <TestCard index={item} key={item} />
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default index;
