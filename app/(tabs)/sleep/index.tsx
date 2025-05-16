import SleepCourseCard from "@/components/sleep/course-card-sleep";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";
const Tests = () => {
  return (
    <VStack space="md" className="bg-background-900 py-4 flex-1">
      <VStack className="h-56 rounded-3xl bg-background-700 mx-5"></VStack>
      <VStack space="lg" className="mt-4 ">
        <HStack className="items-center justify-between  mx-5">
          <Text className="text-typography-400 text-md">مشاهده همه</Text>

          <Text className="text-xl text-white font-bold">آهنگ‌های خواب</Text>
        </HStack>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            flexDirection: "row-reverse",
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <SleepCourseCard key={item} />
          ))}
        </ScrollView>
      </VStack>
      <VStack space="lg" className="mt-4 ">
        <HStack className="items-center justify-between  mx-5">
          <Text className="text-typography-400 text-md">مشاهده همه</Text>

          <Text className="text-xl  text-white font-bold">
            مدیتیشن‌های خواب
          </Text>
        </HStack>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            flexDirection: "row-reverse",
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <SleepCourseCard key={item} />
          ))}
        </ScrollView>
      </VStack>
    </VStack>
  );
};

export default Tests;
