import SleepCourseCard from "@/components/sleep/course-card-sleep";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Tests = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);
  const sleepMusics = exploreData?.meditations.sleepMusic;
  const sleepMedias = exploreData?.meditations.sleep;
  const sleepStories = exploreData?.meditations.story;

  return (
    <LinearGradient
      colors={["#16213e", "#0a0a0f", "#1a1a2e"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={["top"]} className="flex-1  bg-transparent">
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <LinearGradient
            colors={["#1a1a2e", "#16213e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.1)",
            }}
          >
            <HStack className="items-center justify-between">
              <TouchableOpacity
                onPress={() => router.push("/explore/search-page")}
                className="w-10 h-10 rounded-full bg-white/10 justify-center items-center"
              >
                <Feather name="search" size={20} color="white" />
              </TouchableOpacity>
              <HStack space="sm" className="items-center">
                <Feather name="moon" size={20} color="#79AED6" />
                <Text className="text-white font-vazirBold text-lg">
                  خواب آرام
                </Text>
              </HStack>

              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
              >
                <Feather name="chevron-down" size={24} color="transparent" />
              </TouchableOpacity>
            </HStack>
          </LinearGradient>
        </Animated.View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <VStack space="lg" className="py-4 pb-20 flex-1">
            {/* Featured Stories Section */}
            <Animated.View entering={FadeInUp.duration(600).delay(100)}>
              <VStack space="md">
                <HStack className="items-center justify-between mx-5">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/sleep/all-musics",
                        params: { type: "story" },
                      })
                    }
                  >
                    <HStack space="sm" className="items-center">
                      <Text className="text-primary-300 text-sm font-vazir">
                        مشاهده همه
                      </Text>
                      <Feather name="arrow-left" size={14} color="#79AED6" />
                    </HStack>
                  </TouchableOpacity>
                  <HStack space="sm" className="items-center">
                    <Text className="font-vazirBold text-white text-xl">
                      قصه‌های شب
                    </Text>
                    <MaterialIcons
                      name="auto-stories"
                      size={22}
                      color="#79AED6"
                    />
                  </HStack>
                </HStack>

                <ScrollView
                  contentContainerStyle={{ paddingHorizontal: 12 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {isLoading
                    ? [1, 2, 3, 4].map((item) => (
                        <Skeleton
                          key={item}
                          style={{ width: width - 60 }}
                          className="h-56 mx-2 rounded-2xl bg-gray-800"
                        />
                      ))
                    : sleepStories?.map((item, index) => (
                        <Animated.View
                          key={item.id}
                          entering={FadeInUp.duration(400).delay(
                            150 + index * 100
                          )}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              router.push({
                                pathname: "/player",
                                params: { id: item.id },
                              });
                            }}
                            activeOpacity={0.9}
                          >
                            <LinearGradient
                              colors={["#1a1a2e", "#16213e"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                width: width - 60,
                                height: 220,
                                borderRadius: 24,
                                marginHorizontal: 8,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.1)",
                              }}
                            >
                              <Image
                                source={{ uri: BASE_URL_IMAGES + item.image }}
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  opacity: 0.3,
                                }}
                                resizeMode="cover"
                              />

                              {/* Decorative elements */}
                              <View className="absolute top-4 right-4">
                                <MaterialIcons
                                  name="auto-stories"
                                  size={32}
                                  color="rgba(255,255,255,0.2)"
                                />
                              </View>

                              <View className="flex-1 justify-between p-6">
                                <View>
                                  <Text className="text-white font-vazirBold text-2xl text-right mb-2">
                                    {item.title}
                                  </Text>
                                  <Text className="text-white/70 font-vazir text-sm text-right line-clamp-2">
                                    {item.description}
                                  </Text>
                                </View>

                                <HStack className="items-center justify-between mt-4">
                                  <View className="flex-row items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                                    <Feather
                                      name="headphones"
                                      size={12}
                                      color="rgba(255,255,255,0.6)"
                                    />
                                    <Text className="text-white/60 font-vazir text-xs">
                                      {item.duration} دقیقه
                                    </Text>
                                  </View>
                                  <View className="bg-primary-500/20 rounded-full p-2">
                                    <Feather
                                      name="play"
                                      size={16}
                                      color="#79AED6"
                                    />
                                  </View>
                                </HStack>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animated.View>
                      ))}
                </ScrollView>
              </VStack>
            </Animated.View>

            {/* Sleep Meditations Section */}
            <Animated.View entering={FadeInUp.duration(600).delay(250)}>
              <VStack space="lg" className="mt-6">
                <HStack className="items-center justify-between mx-5">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/sleep/all-musics",
                        params: { type: "sleep" },
                      })
                    }
                  >
                    <HStack space="sm" className="items-center">
                      <Text className="text-primary-300 text-sm font-vazir">
                        مشاهده همه
                      </Text>
                      <Feather name="arrow-left" size={14} color="#79AED6" />
                    </HStack>
                  </TouchableOpacity>
                  <HStack space="sm" className="items-center">
                    <Text className="font-vazirBold text-white text-xl">
                      مدیتیشن‌های خواب
                    </Text>
                    <Feather name="moon" size={22} color="#79AED6" />
                  </HStack>
                </HStack>

                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 12,
                    flexDirection: "row-reverse",
                  }}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                >
                  {isLoading
                    ? [1, 2, 3, 4].map((item) => (
                        <Skeleton
                          key={item}
                          className="h-52 w-48 mx-2 rounded-2xl bg-gray-800"
                        />
                      ))
                    : sleepMedias?.map((item, index) => (
                        <SleepCourseCard
                          index={index}
                          item={item}
                          key={item.id}
                        />
                      ))}
                </ScrollView>
              </VStack>
            </Animated.View>

            {/* Sleep Music Section */}
            <Animated.View entering={FadeInUp.duration(600).delay(400)}>
              <VStack space="lg" className="mt-6">
                <HStack className="items-center justify-between mx-5">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/sleep/all-musics",
                        params: { type: "sleep-music" },
                      })
                    }
                  >
                    <HStack space="sm" className="items-center">
                      <Text className="text-primary-300 text-sm font-vazir">
                        مشاهده همه
                      </Text>
                      <Feather name="arrow-left" size={14} color="#79AED6" />
                    </HStack>
                  </TouchableOpacity>
                  <HStack space="sm" className="items-center">
                    <Text className="font-vazirBold text-white text-xl">
                      آهنگ‌های خواب
                    </Text>
                    <Ionicons name="musical-notes" size={22} color="#79AED6" />
                  </HStack>
                </HStack>

                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 12,
                    flexDirection: "row-reverse",
                  }}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                >
                  {isLoading
                    ? [1, 2, 3, 4].map((item) => (
                        <Skeleton
                          key={item}
                          className="h-52 w-48 mx-2 rounded-2xl bg-gray-800"
                        />
                      ))
                    : sleepMusics?.map((item, index) => (
                        <SleepCourseCard
                          index={index}
                          item={item}
                          key={item.id}
                        />
                      ))}
                </ScrollView>
              </VStack>
            </Animated.View>

            {/* Sleep Tips Section */}
            <Animated.View entering={FadeInUp.duration(600).delay(550)}>
              <View className="mx-5 mb-40 mt-8">
                <LinearGradient
                  colors={["#1a1a2e", "#16213e"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 24,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <HStack className="items-center gap-3">
                    <View className="bg-primary-500/20 rounded-full p-3">
                      <AntDesign name="bulb" size={24} color="#79AED6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-vazirBold text-base text-right">
                        نکته برای خواب بهتر
                      </Text>
                      <Text className="text-white/60 font-vazir text-xs text-right mt-1">
                        قبل از خواب از صفحه نمایش استفاده نکنید و محیطی آرام
                        برای خود ایجاد کنید
                      </Text>
                    </View>
                  </HStack>
                </LinearGradient>
              </View>
            </Animated.View>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default React.memo(Tests);
