import CourseCard from "@/components/home/course-card";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView } from "react-native";

const Explore = () => {
  return (
    <VStack className="flex-1 bg-background-50 pt-8">
      <ScrollView className="flex-1  bg-background-50">
        <Input size="xl" className="m-4 bg-white  rounded-lg ">
          <InputSlot className="px-4 items-center">
            <InputIcon as={(props) => <Feather name="search" {...props} size={18} color="black" />} />
          </InputSlot>
          <InputField placeholder="جستجو" />
        </Input>
        <VStack space="md" className="m-4">
          <HStack space="md">
            <VStack className="bg-green-300 flex-1 justify-center items-center rounded-lg h-28">
              <Text className="text-white text-2xl font-semiBold">آرامش</Text>
            </VStack>
            <VStack className="bg-purple-300 flex-1 justify-center items-center rounded-lg h-28">
              <Text className="text-white text-2xl font-semiBold">خواب</Text>
            </VStack>
          </HStack>
          <HStack space="md">
            <VStack className="bg-red-300 flex-1 rounded-lg justify-center items-center h-28">
              <Text className="text-white text-2xl font-semiBold">استرس</Text>
            </VStack>
            <VStack className="bg-blue-300 flex-1 rounded-lg justify-center items-center h-28">
              <Text className="text-white text-2xl font-semiBold">ناراحتی</Text>
            </VStack>
          </HStack>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md">مشاهده همه</Text>

            <Text>آرامش</Text>
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
              <CourseCard index={item} key={item} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md">مشاهده همه</Text>

            <Text>آرامش</Text>
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
              <CourseCard index={item} key={item} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md">مشاهده همه</Text>

            <Text>آرامش</Text>
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
              <CourseCard index={item} key={item} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md">مشاهده همه</Text>

            <Text>آرامش</Text>
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
              <CourseCard index={item} key={item} />
            ))}
          </ScrollView>
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default Explore;
