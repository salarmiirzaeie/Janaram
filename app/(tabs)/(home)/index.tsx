import CourseCard from "@/components/home/course-card";
import MinimalChart from "@/components/home/minimal-chart";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";

const index = () => {
  return (
    <ScrollView>
      <VStack className="flex-1  py-4 bg-background-50">
        <VStack className="w-full items-center  justify-center p-5">
          {/* <Pressable className="w-60 h-60 rounded-full bg-primary-500 items-center justify-center">
            <Feather name="smile" size={36} color="white" />
            <Text className="text-white mt-4 text-lg font-bold">
              امروز چه حسی داری؟
            </Text>
          </Pressable> */}
          <Pressable className="w-full h-60 items-center rounded-3xl bg-blue-200 p-6 justify-center">
            <HStack className="items-center justify-center">
              <VStack>
                <Text className="text-typography-400 text-white text-center font-medium text-sm">
                  مود امروز
                </Text>
                <Text
                  style={{ fontSize: 60, fontWeight: "bold", lineHeight: 80 }}
                >
                  😄
                </Text>
              </VStack>
              <VStack>
                <MinimalChart />
              </VStack>
            </HStack>
          </Pressable>
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
              <CourseCard index={index} key={item} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="md" className="mt-6 px-5">
          <HStack className="items-center justify-between">
            <Text className="text-typography-400 text-sm">مشاهده همه</Text>
            <Text className="text-typography-700 text-lg font-semiBold">
              تست های جدید
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
