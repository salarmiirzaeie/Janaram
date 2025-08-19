import SleepCourseCard from "@/components/sleep/course-card-sleep";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView } from "react-native";
const Tests = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);
  const sleepMusics = exploreData?.meditations.sleepMusic;
  const sleepMedias = exploreData?.meditations.sleep;

  const sleepStories = exploreData?.meditations.story;
  return (
    <ScrollView className="flex-1 bg-background-900">
      <VStack space="md" className="bg-background-900 py-4 pb-20 flex-1">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }} horizontal showsHorizontalScrollIndicator={false}>
          {isLoading
            ? [1, 2, 3, 4].map((item, index) => (
                <Skeleton
                  key={item}
                  style={{ width: Dimensions.get("screen").width - 60 }}
                  className="h-56  mx-2 rounded-xl"
                />
              ))
            : sleepStories?.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    router.push({
                      pathname: "/player",
                      params: { id: item.id },
                    });
                  }}
                >
                  <VStack
                    style={{ width: Dimensions.get("screen").width - 60 }}
                    className="h-56 rounded-3xl   bg-background-700 mx-2"
                  >
                    <Image
                      source={{
                        uri: BASE_URL_IMAGES + item.image,
                      }}
                      className="absolute top-0 left-0 right-0 bottom-0 h-56 w-full opacity-50 rounded-3xl"
                      resizeMode="cover"
                    />
                    <Text className=" text-white font-semiBold text-2xl text-right m-6">{item.title}</Text>
                    <HStack className="flex-1 my-2 mx-6">
                      <Text className=" text-white  font-medium text-sm text-right  self-end">{item.duration}</Text>

                      <Text className=" text-white font-medium text-md text-right flex-1">{item.description}</Text>
                    </HStack>
                  </VStack>
                </Pressable>
              ))}
        </ScrollView>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-semiBold text-white text-xl">مدیتیشن‌های خواب</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {isLoading
              ? [1, 2, 3, 4].map((item, index) => <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />)
              : sleepMedias?.map((item, index) => <SleepCourseCard index={index} item={item} key={item.id} />)}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/sleep/all-musics",
                  params: {
                    type: "sleep-music",
                  },
                })
              }
            >
              <Text className="text-typography-400 text-md">مشاهده همه</Text>
            </Pressable>

            <Text className="font-semiBold text-white text-xl">آهنگ‌های خواب</Text>
          </HStack>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: "row-reverse",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {isLoading
              ? [1, 2, 3, 4].map((item, index) => <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />)
              : sleepMusics?.map((item, index) => <SleepCourseCard index={index} item={item} key={item.id} />)}
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default React.memo(Tests);
