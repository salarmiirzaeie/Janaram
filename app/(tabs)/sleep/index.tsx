import SleepCourseCard from "@/components/sleep/course-card-sleep";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import data from "@/database/sleep-music.json";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView } from "react-native";
const Tests = () => {
  const sleepMusics = data.slice(0, 5);
  const sleepMedias = data.slice(15, 20);
  const sleepStories = data.slice(20, 22);
  return (
    <ScrollView className="flex-1 bg-background-900">
      <VStack space="md" className="bg-background-900 py-4 flex-1">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }} horizontal showsHorizontalScrollIndicator={false}>
          {sleepStories.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                router.push({
                  pathname: "/player",
                  params: { id: `sleep/${item.id}`, title: item.title, artist: item.artist, image: item.image },
                });
              }}
            >
              <VStack
                style={{ width: Dimensions.get("screen").width - 60 }}
                className="h-56 rounded-3xl   bg-background-700 mx-2"
              >
                <Image
                  source={{
                    uri: item.image,
                  }}
                  className="absolute top-0 left-0 right-0 bottom-0 h-56 w-full opacity-50 rounded-3xl"
                  resizeMode="cover"
                />
                <Text className=" text-white font-semiBold text-2xl text-right m-6">{item.title}</Text>
                <HStack className="flex-1 my-2 mx-6">
                  <Text className=" text-white  font-medium text-sm text-right  self-end">{item.duration}</Text>

                  <Text className=" text-white font-medium text-md text-right flex-1">{item.artist}</Text>
                </HStack>
              </VStack>
            </Pressable>
          ))}
        </ScrollView>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md">مشاهده همه</Text>

            <Text className="text-xl  text-white font-bold">مدیتیشن‌های خواب</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {sleepMedias.map((item) => (
              <SleepCourseCard item={item} key={item.id} />
            ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/sleep/all-musics",
                  params: {
                    fileName: "sleep-music",
                  },
                })
              }
            >
              <Text className="text-typography-400 text-md">مشاهده همه</Text>
            </Pressable>

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
            {sleepMusics.map((item) => (
              <SleepCourseCard isSleepMusic item={item} key={item.id} />
            ))}
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default Tests;
