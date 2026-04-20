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
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2; // 2 کارت در هر ردیف

const Explore = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // ========== استفاده از useMemo برای جلوگیری از بازسازی ==========
  const categories = useMemo(
    () => [
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
    ],
    []
  );

  const calmMedias = exploreData?.meditations?.calm;
  const loveMedias = exploreData?.meditations?.love;
  const instrumentalMedias = exploreData?.meditations?.instrumental;
  const nature = exploreData?.meditations?.nature;
  const self = exploreData?.meditations?.self;

  const sections = useMemo(
    () => [
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
        icon: (
          <MaterialIcons name="self-improvement" size={24} color="#9966CC" />
        ),
        data: self,
        color: ["#9966CC", "#804DB3"],
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
    ],
    [calmMedias, loveMedias, instrumentalMedias, nature, self]
  );

  // ========== هندلرهای نویگیشن با useCallback ==========
  const handleCategoryPress = useCallback((catId: string, title: string) => {
    if (catId === "sleep") {
      router.push("/sleep");
    } else {
      router.push({
        pathname: "/explore/all-files",
        params: { type: catId, title },
      });
    }
  }, []);

  const handleSeeAllPress = useCallback((sectionId: string, title: string) => {
    router.push({
      pathname: "/explore/all-files",
      params: { type: sectionId, title },
    });
  }, []);

  const handleSearchPress = useCallback(() => {
    router.navigate("/explore/search-page");
  }, []);

  // ========== رندر هدر ==========
  const renderHeader = useCallback(() => {
    const AnimationWrapper = isFirstLoad ? Animated.View : View;
    const animationProps = isFirstLoad
      ? { entering: FadeInUp.duration(600).springify() }
      : {};

    return (
      <AnimationWrapper {...animationProps}>
        <HStack className="mx-5 items-center justify-between mb-6">
          <TouchableOpacity onPress={handleSearchPress} className="flex-1">
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
      </AnimationWrapper>
    );
  }, [isFirstLoad, handleSearchPress]);

  // ========== رندر دسته‌بندی‌ها (گرید) ==========
  const renderCategories = useCallback(() => {
    const AnimationWrapper = isFirstLoad ? Animated.View : View;
    const animationProps = isFirstLoad
      ? { entering: FadeInUp.duration(600).delay(100) }
      : {};

    return (
      <AnimationWrapper {...animationProps}>
        <View className="mx-5 mb-0">
          <View className="flex-row flex-wrap gap-3">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className="flex-1 min-w-[30%]"
                onPress={() => handleCategoryPress(cat.id, cat.title)}
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
          </View>
        </View>
      </AnimationWrapper>
    );
  }, [categories, isFirstLoad, handleCategoryPress]);

  // ========== رندر هر سکشن ==========
  const renderSection = useCallback(
    ({
      item: section,
      index,
    }: {
      item: (typeof sections)[0];
      index: number;
    }) => {
      const AnimationWrapper = isFirstLoad ? Animated.View : View;
      const animationProps = isFirstLoad
        ? { entering: FadeInUp.duration(600).delay(200 + index * 100) }
        : {};

      return (
        <AnimationWrapper {...animationProps}>
          <VStack space="lg" className="mt-6">
            <HStack className="items-center justify-between mx-5">
              <TouchableOpacity
                onPress={() => handleSeeAllPress(section.id, section.title)}
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

            {/* لیست افقی با FlatList به جای ScrollView */}
            <FlatList
              data={section.data}
              keyExtractor={(item) => item.id?.toString() || item.title}
              renderItem={({ item, index: itemIndex }) => (
                <CourseCard item={item} index={itemIndex} key={item.id} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
              removeClippedSubviews={true}
              getItemLayout={(_, index) => ({
                length: CARD_WIDTH + 16, // عرض کارت + فاصله
                offset: (CARD_WIDTH + 16) * index,
                index,
              })}
              ListEmptyComponent={
                isLoading ? (
                  <HStack space="md" className="px-3">
                    {[1, 2, 3, 4].map((item) => (
                      <Skeleton
                        key={item}
                        className="h-52 w-48 mx-2 rounded-2xl"
                      />
                    ))}
                  </HStack>
                ) : null
              }
            />
          </VStack>
        </AnimationWrapper>
      );
    },
    [isFirstLoad, isLoading, handleSeeAllPress]
  );

  // ========== مموری لین (جلوگیری از لود شدن دوباره) ==========
  const memoizedSections = useMemo(() => sections, [sections]);

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF"]}
      style={{ flex: 1, paddingBottom: 80 }}
    >
      <FlatList
        data={memoizedSections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderCategories()}
          </>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 32 }}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </LinearGradient>
  );
};

export default React.memo(Explore);
