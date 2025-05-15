import CourseCard from "@/components/home/course-card";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";

const Explore = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <Input className="m-4">
        <InputField />
      </Input>
      <VStack space="md" className="m-4">
        <HStack space="md">
          <VStack className="bg-purple-400 flex-1 rounded-lg h-28">
            <Text> Calm</Text>
          </VStack>
          <VStack className="bg-green-400 flex-1 rounded-lg h-28">
            <Text> Calm</Text>
          </VStack>
        </HStack>
        <HStack space="md">
          <VStack className="bg-red-400 flex-1 rounded-lg h-28">
            <Text> Calm</Text>
          </VStack>
          <VStack className="bg-blue-400 flex-1 rounded-lg h-28">
            <Text> Calm</Text>
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
            <CourseCard key={item} />
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
            <CourseCard key={item} />
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
            <CourseCard key={item} />
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
            <CourseCard key={item} />
          ))}
        </ScrollView>
      </VStack>
    </ScrollView>
  );
};

export default Explore;
