import CourseCard from "@/components/home/course-card";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import data from "@/database/database.json";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

const Explore = () => {
  const calmMedias = data.slice(0, 5).sort((a, b) => b.id - a.id);
  const loveMedias = data.slice(5, 10).sort((a, b) => b.id - a.id);
  const instrumentalMedias = data.slice(10, 15).sort((a, b) => b.id - a.id);

  return (
    <ScrollView className="flex-1  bg-background-50 ">
      <VStack className="flex-1 py-safe-offset-4 bg-background-50 pt-8 pb-20">
        <Pressable onPress={() => router.navigate("/explore/search-page")}>
          <HStack className="mx-4 bg-white border-2 border-gray-200 rounded-lg p-3 items-start ">
            <Feather name="search" size={18} color="black" />
          </HStack>
        </Pressable>

        <VStack space="md" className="m-4">
          <HStack space="md">
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "1", title: "آرامش" },
                })
              }
            >
              <VStack className="bg-green-300 flex-1 justify-center items-center rounded-lg h-14">
                <Text className="text-white text-xl font-semiBold">آرامش 🌿</Text>
              </VStack>
            </Pressable>
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "2", title: "عشق" },
                })
              }
            >
              <VStack className="bg-purple-300 flex-1 justify-center items-center rounded-lg h-14">
                <Text className="text-white text-xl font-semiBold">عشق 💗</Text>
              </VStack>
            </Pressable>
          </HStack>
          {/* <HStack space="md">
            <VStack className="bg-red-300 flex-1 rounded-lg justify-center items-center h-14">
              <Text className="text-white text-xl font-semiBold">تمرکز 🧠</Text>
            </VStack>
            <VStack className="bg-blue-300 flex-1 rounded-lg justify-center items-center h-14">
              <Text className="text-white text-xl font-semiBold">هدف‌گذاری 🎯</Text>
            </VStack>
          </HStack> */}
          <HStack space="md">
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "3", title: "بی کلام" },
                })
              }
            >
              <VStack className="bg-pink-300 rounded-lg justify-center items-center h-14">
                <Text className="text-white text-xl font-semiBold"> بی کلام 🤫 </Text>
              </VStack>
            </Pressable>
            <Pressable className="flex-1" onPress={() => router.push("/sleep")}>
              <VStack className="bg-indigo-300  rounded-lg justify-center items-center h-14">
                <Text className="text-white text-xl font-semiBold">خواب خوب 🌙</Text>
              </VStack>
            </Pressable>
          </HStack>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-semiBold text-xl">آرامش</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {calmMedias.map((item, index) => (
              <CourseCard item={item} index={index} key={item.id} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-semiBold text-xl">عشق</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {loveMedias.map((item, index) => (
              <CourseCard item={item} index={index + 1} key={item.id} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-semiBold text-xl">بی کلام</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {instrumentalMedias.map((item, index) => (
              <CourseCard item={item} index={index + 2} key={item.id} />
            ))}
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default Explore;
