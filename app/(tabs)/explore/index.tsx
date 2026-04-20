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
import React, { useCallback, useMemo } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2;

// ========== کامپوننت مجزا برای آیتم دسته‌بندی ==========
const CategoryItem = React.memo(
  ({ cat, onPress }: { cat: any; onPress: () => void }) => (
    <TouchableOpacity
      className="flex-1 min-w-[30%]"
      onPress={onPress}
      activeOpacity={0.7}
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
        <Text className="text-white font-vazirBold text-sm">{cat.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
);

// ========== کامپوننت مجزا برای هدر سکشن ==========
const SectionHeader = React.memo(
  ({
    title,
    icon,
    onSeeAll,
  }: {
    title: string;
    icon: React.ReactNode;
    onSeeAll: () => void;
  }) => (
    <HStack className="items-center justify-between mx-5 mb-3">
      <TouchableOpacity onPress={onSeeAll}>
        <HStack space="sm" className="items-center">
          <Text className="text-primary-600 text-sm font-vazir">
            مشاهده همه
          </Text>
          <Ionicons name="chevron-back" size={16} color="#79AED6" />
        </HStack>
      </TouchableOpacity>
      <HStack space="sm" className="items-center">
        <Text className="text-xl font-vazirBold text-primary-800">{title}</Text>
        <View className="ml-1">{icon}</View>
      </HStack>
    </HStack>
  )
);

// ========== کامپوننت مجزا برای سکشن افقی ==========
const HorizontalSection = React.memo(
  ({
    data,
    isLoading,
    title,
    icon,
    onSeeAll,
  }: {
    data: any[];
    isLoading: boolean;
    title: string;
    icon: React.ReactNode;
    onSeeAll: () => void;
  }) => {
    if ((!data || data.length === 0) && !isLoading) return null;

    return (
      <VStack space="lg" className="mt-6">
        <SectionHeader title={title} icon={icon} onSeeAll={onSeeAll} />

        <FlatList
          data={data || []}
          keyExtractor={(item, index) =>
            item?.id?.toString() || `item-${title}-${index}`
          }
          renderItem={({ item, index }) => (
            <CourseCard item={item} index={index} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + 16,
            offset: (CARD_WIDTH + 16) * index,
            index,
          })}
          ListEmptyComponent={
            isLoading ? (
              <HStack space="md" className="px-3">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-52 w-48 mx-2 rounded-2xl" />
                ))}
              </HStack>
            ) : null
          }
        />
      </VStack>
    );
  }
);

// ========== کامپوننت اصلی ==========
const Explore = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null, {
    refetchOnMountOrArgChange: false,
  });

  // ========== استخراج دیتا با useMemo ==========
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

  // ========== دیتای سکشن‌ها ==========
  const sectionsData = useMemo(() => {
    if (!exploreData?.meditations) return [];

    const m = exploreData.meditations;
    const sections = [];

    if (m.calm?.length) {
      sections.push({
        id: "calm",
        title: "آرامش",
        icon: <Feather name="wind" size={24} color="#79AED6" />,
        data: m.calm,
        onSeeAll: () => handleSeeAllPress("calm", "آرامش"),
      });
    }

    if (m.self?.length) {
      sections.push({
        id: "self",
        title: "خودسازی",
        icon: (
          <MaterialIcons name="self-improvement" size={24} color="#9966CC" />
        ),
        data: m.self,
        onSeeAll: () => handleSeeAllPress("self", "خودسازی"),
      });
    }

    if (m.love?.length) {
      sections.push({
        id: "love",
        title: "عشق",
        icon: <Ionicons name="heart" size={24} color="#FF9966" />,
        data: m.love,
        onSeeAll: () => handleSeeAllPress("love", "عشق"),
      });
    }

    if (m.instrumental?.length) {
      sections.push({
        id: "instrumental",
        title: "بی کلام",
        icon: <FontAwesome5 name="guitar" size={22} color="#91A5BE" />,
        data: m.instrumental,
        onSeeAll: () => handleSeeAllPress("instrumental", "بی کلام"),
      });
    }

    if (m.nature?.length) {
      sections.push({
        id: "nature",
        title: "طبیعت",
        icon: <MaterialIcons name="nature-people" size={24} color="#79AED6" />,
        data: m.nature,
        onSeeAll: () => handleSeeAllPress("nature", "طبیعت"),
      });
    }

    return sections;
  }, [exploreData]);

  // ========== هندلرها با useCallback ==========
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

  // ========== هدر ==========
  const renderHeader = useCallback(
    () => (
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
    ),
    [handleSearchPress]
  );

  // ========== رندر دسته‌بندی‌ها ==========
  const renderCategories = useCallback(
    () => (
      <View className="mx-5 mb-0">
        <View className="flex-row flex-wrap gap-3">
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              cat={cat}
              onPress={() => handleCategoryPress(cat.id, cat.title)}
            />
          ))}
        </View>
      </View>
    ),
    [categories, handleCategoryPress]
  );

  // اگر در حال لود هستیم و دیتا نداریم
  if (isLoading && !exploreData) {
    return (
      <LinearGradient colors={["#F0F6FA", "#FFFFFF"]} style={{ flex: 1 }}>
        {renderHeader()}
        {renderCategories()}
        <View className="flex-1 items-center justify-center">
          <Text>در حال بارگذاری...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <FlatList
        data={sectionsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HorizontalSection
            data={item.data}
            isLoading={isLoading}
            title={item.title}
            icon={item.icon}
            onSeeAll={item.onSeeAll}
          />
        )}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderCategories()}
          </>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 32 }}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
      />
    </LinearGradient>
  );
};

export default React.memo(Explore);
