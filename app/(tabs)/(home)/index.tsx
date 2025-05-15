import CourseCard from "@/components/home/course-card";
import TestCard from "@/components/home/test-card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView } from "react-native";

const index = () => {
  return (
    <ScrollView>
      <VStack className="flex-1  py-4 bg-white">
        <VStack className="w-full items-center  justify-center p-6">
          <Pressable className="w-60 shadow shadow-xl bg-primary-500 h-60 flex items-center justify-center rounded-full">
            <Feather name="smile" size={24} color="white" />
            <Text className="text-white mt-2 text-lg">امروز چه حسی داری؟</Text>
          </Pressable>
        </VStack>
        <VStack space="lg" className="mt-4 items-end">
          <Text className=" text-lg mr-4">پیشنهاد ها برای شما</Text>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <CourseCard key={item} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="md" className="mt-4 items-end px-5">
          <Text className="text-typography-700 text-lg">تست های جدید</Text>

          {[1, 2, 3, 4].map((item) => (
            <TestCard key={item} />
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default index;
