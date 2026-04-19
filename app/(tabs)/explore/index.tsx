import CourseCard from "@/components/home/course-card";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

const Explore = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);
  const calmMedias = exploreData?.meditations?.calm;
  const loveMedias = exploreData?.meditations.love;
  const instrumentalMedias = exploreData?.meditations.instrumental;
  const nature = exploreData?.meditations.nature;
  const self = exploreData?.meditations.self;

  const categories = [
    {
      id: "calm",
      title: "آرامش",
      icon: <Feather name="wind" size={24} color="white" />,
      color: ["#79AED6", "#5E95BD"],
      route: "calm",
    },
    {
      id: "self",
      title: "خودسازی",
      icon: <MaterialIcons name="self-improvement" size={24} color="white" />,
      color: ["#9966CC", "#804DB3"],
      route: "self",
    },
    {
      id: "instrumental",
      title: "بی کلام",
      icon: <FontAwesome5 name="guitar" size={22} color="white" />,
      color: ["#FF9966", "#E6804D"],
      route: "instrumental",
    },
    {
      id: "sleep",
      title: "خواب خوب",
      icon: <Feather name="moon" size={24} color="white" />,
      color: ["#91A5BE", "#7A8BA8"],
      route: "sleep",
    },
    {
      id: "love",
      title: "عشق",
      icon: <Ionicons name="heart" size={24} color="white" />,
      color: ["#FF9966", "#FFAD85"],
      route: "love",
    },
    {
      id: "nature",
      title: "طبیعت",
      icon: <MaterialIcons name="nature-people" size={24} color="white" />,
      color: ["#79AED6", "#9966CC"],
      route: "nature",
    },
  ];

  const sections = [
    {
      id: "calm",
      title: "آرامش",
      icon: <Feather name="wind" size={24} color="#79AED6" />,
      data: calmMedias,
      color: ["#79AED6", "#5E95BD"],
    },
    {
      id: "self",
      title: "خودسازی",
      icon: <MaterialIcons name="self-improvement" size={24} color="#9966CC" />,
      data: self,
      color: ["#9966CC", "#804DB3"],
    },
    {
      id: "love",
      title: "عشق",
      icon: <Ionicons name="heart" size={24} color="#FF9966" />,
      data: loveMedias,
      color: ["#FF9966", "#E6804D"],
    },
    {
      id: "instrumental",
      title: "بی کلام",
      icon: <FontAwesome5 name="guitar" size={22} color="#91A5BE" />,
      data: instrumentalMedias,
      color: ["#91A5BE", "#7A8BA8"],
    },
    {
      id: "nature",
      title: "طبیعت",
      icon: <MaterialIcons name="nature-people" size={24} color="#79AED6" />,
      data: nature,
      color: ["#79AED6", "#9966CC"],
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <LinearGradient colors={["#F0F6FA", "#FFFFFF"]} style={{ flex: 1 }}>
        <VStack className="flex-1 pt-8 pb-40">
          {/* Header Section */}
          <Animated.View entering={FadeInUp.duration(600).springify()}>
            <HStack className="mx-5 items-center justify-between mb-6">
              <TouchableOpacity
                onPress={() => router.navigate("/explore/search-page")}
                className="flex-1"
              >
                <LinearGradient
                  colors={["#F5F0FA", "#FFFFFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderWidth: 1,
                    borderColor: "#E9EDF2",
                  }}
                >
                  <Feather name="search" size={20} color="#79AED6" />
                  <Text className="text-gray-400 font-vazir flex-1 text-right">
                    جستجوی مدیتیشن، موسیقی و...
                  </Text>
                  <Feather name="mic" size={20} color="#79AED6" />
                </LinearGradient>
              </TouchableOpacity>
            </HStack>
          </Animated.View>

          {/* Categories Grid */}
          <Animated.View entering={FadeInUp.duration(600).delay(100)}>
            <View className="mx-5 mb-8">
              <HStack className="flex-wrap gap-3">
                {categories.map((cat, idx) => (
                  <TouchableOpacity
                    key={cat.id}
                    className="flex-1 min-w-[30%]"
                    onPress={() => {
                      if (cat.id === "sleep") {
                        router.push("/sleep");
                      } else {
                        router.push({
                          pathname: "/explore/all-files",
                          params: { type: cat.route, title: cat.title },
                        });
                      }
                    }}
                  >
                    <LinearGradient
                      colors={cat.color}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 20,
                        paddingVertical: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: cat.color[0],
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View className="mb-1">{cat.icon}</View>
                      <Text className="text-white font-vazirBold text-sm">
                        {cat.title}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </HStack>
            </View>
          </Animated.View>

          {/* Sections */}
          {sections.map((section, sectionIdx) => (
            <Animated.View
              key={section.id}
              entering={FadeInUp.duration(600).delay(200 + sectionIdx * 100)}
            >
              <VStack space="lg" className="mt-6">
                <HStack className="items-center justify-between mx-5">
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/explore/all-files",
                        params: { type: section.id, title: section.title },
                      });
                    }}
                  >
                    <HStack space="sm" className="items-center">
                      <Text className="text-primary-600 text-sm font-vazir">
                        مشاهده همه
                      </Text>
                      <Ionicons name="chevron-back" size={16} color="#79AED6" />
                    </HStack>
                  </TouchableOpacity>
                  <HStack space="sm" className="items-center">
                    <Text className="text-xl font-vazirBold text-primary-800">
                      {section.title}
                    </Text>
                    <View className="ml-1">{section.icon}</View>
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
                          className="h-52 w-48 mx-2 rounded-2xl"
                        />
                      ))
                    : section.data?.map((item, index) => (
                        <CourseCard
                          item={item}
                          index={index + sectionIdx}
                          key={item.id}
                        />
                      ))}
                </ScrollView>
              </VStack>
            </Animated.View>
          ))}

          {/* Bottom Space */}
          <View className="h-8" />
        </VStack>
      </LinearGradient>
    </ScrollView>
  );
};

export default React.memo(Explore);
