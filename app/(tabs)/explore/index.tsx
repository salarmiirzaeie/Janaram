import CourseCard from "@/components/home/course-card";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

const Explore = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);
  const calmMedias = exploreData?.meditations?.calm;
  const loveMedias = exploreData?.meditations.love;
  const instrumentalMedias = exploreData?.meditations.instrumental;
  const nature = exploreData?.meditations.nature;

  return (
    <ScrollView className="flex-1">
      <VStack className="flex-1 py-safe-offset-4 bg-white pt-8 pb-20">
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
                  params: { type: "calm", title: "آرامش" },
                })
              }
            >
              <VStack className="bg-calm-300 flex-1 justify-center items-center rounded-2xl h-14">
                <Text className="text-white text-xl font-vazirBold">
                  آرامش 🌿
                </Text>
              </VStack>
            </Pressable>
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "self", title: "خودسازی" },
                })
              }
            >
              <VStack className="bg-primary-300 rounded-2xl justify-center items-center h-14">
                <Text className="text-white text-xl font-vazirBold">
                  خودسازی 🧠
                </Text>
              </VStack>
            </Pressable>
          </HStack>

          <HStack space="md">
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "instrumental", title: "بی کلام" },
                })
              }
            >
              <VStack className="bg-primary-300 rounded-2xl justify-center items-center h-14">
                <Text className="text-white text-xl font-vazirBold">
                  بی کلام 🎸
                </Text>
              </VStack>
            </Pressable>
            <Pressable className="flex-1" onPress={() => router.push("/sleep")}>
              <VStack className="bg-secondary-300  rounded-2xl justify-center items-center h-14">
                <Text className="text-white text-xl font-vazirBold">
                  خواب خوب 🌙
                </Text>
              </VStack>
            </Pressable>
          </HStack>
          <HStack space="md">
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "love", title: "عشق" },
                })
              }
            >
              <VStack className="bg-secondary-300 flex-1 justify-center items-center rounded-2xl h-14">
                <Text className="text-white text-xl font-vazirBold">
                  عشق 💗
                </Text>
              </VStack>
            </Pressable>
            <Pressable
              className="flex-1"
              onPress={() =>
                router.push({
                  pathname: "/explore/all-files",
                  params: { type: "nature", title: "طبیعت" },
                })
              }
            >
              <VStack className="bg-calm-300  rounded-2xl justify-center items-center h-14">
                <Text className="text-white text-xl font-vazirBold">
                  طبیعت 🌳
                </Text>
              </VStack>
            </Pressable>
          </HStack>
        </VStack>

        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-vazirBold text-xl">آرامش</Text>
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
              ? [1, 2, 3, 4].map((item, index) => (
                  <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />
                ))
              : calmMedias?.map((item, index) => (
                  <CourseCard item={item} index={index} key={item.id} />
                ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-vazirBold text-xl">عشق</Text>
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
              ? [1, 2, 3, 4].map((item, index) => (
                  <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />
                ))
              : loveMedias?.map((item, index) => (
                  <CourseCard item={item} index={index + 1} key={item.id} />
                ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-vazirBold text-xl">بی کلام</Text>
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
              ? [1, 2, 3, 4].map((item, index) => (
                  <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />
                ))
              : instrumentalMedias?.map((item, index) => (
                  <CourseCard item={item} index={index + 2} key={item.id} />
                ))}
          </ScrollView>
        </VStack>
        <VStack space="lg" className="mt-4 ">
          <HStack className="items-center justify-between  mx-5">
            <Text className="text-typography-400 text-md"> </Text>

            <Text className="font-vazirBold text-xl">طبیعت</Text>
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
              ? [1, 2, 3, 4].map((item, index) => (
                  <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />
                ))
              : nature
                  ?.slice(0, 5)
                  .map((item, index) => (
                    <CourseCard item={item} index={index} key={item.id} />
                  ))}
          </ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default React.memo(Explore);
