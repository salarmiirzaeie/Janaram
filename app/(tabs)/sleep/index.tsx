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
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

// ========== استایل‌های استاتیک با StyleSheet ==========
const createStyles = (CARD_WIDTH: number, SMALL_CARD_WIDTH: number) =>
  StyleSheet.create({
    storyCardGradient: {
      width: CARD_WIDTH,
      height: 220,
      borderRadius: 24,
      marginHorizontal: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    mainHeaderGradient: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.1)",
    },
    tipsGradient: {
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    skeletonStory: {
      width: CARD_WIDTH,
      height: 224,
      marginHorizontal: 8,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    skeletonSmall: {
      width: SMALL_CARD_WIDTH,
      height: 208,
      marginHorizontal: 8,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.05)",
    },
  });

// ========== کامپوننت مجزا برای کارت قصه ==========
const StoryCard = React.memo(({ item }: { item: any; index: number }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const CARD_WIDTH = SCREEN_WIDTH - 60;
  const styles = useMemo(() => createStyles(CARD_WIDTH, 0), [CARD_WIDTH]);

  const handlePress = useCallback(() => {
    router.push({
      pathname: "/player",
      params: { id: item.id },
    });
  }, [item.id]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.storyCardGradient}
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
              <Feather name="play" size={16} color="#79AED6" />
            </View>
          </HStack>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

// ========== کامپوننت مجزا برای هدر هر سکشن ==========
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
          <Text className="text-primary-300 text-sm font-vazir">
            مشاهده همه
          </Text>
          <Feather name="arrow-left" size={14} color="#79AED6" />
        </HStack>
      </TouchableOpacity>
      <HStack space="sm" className="items-center">
        <Text className="font-vazirBold text-white text-xl">{title}</Text>
        {icon}
      </HStack>
    </HStack>
  )
);

// ========== کامپوننت مجزا برای هدر اصلی ==========
const MainHeader = React.memo(
  ({ onSearch, onBack }: { onSearch: () => void; onBack: () => void }) => {
    const { width } = useWindowDimensions();
    const styles = useMemo(() => createStyles(width, 0), [width]);

    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.mainHeaderGradient}
      >
        <HStack className="items-center justify-between">
          <TouchableOpacity
            onPress={onSearch}
            className="w-10 h-10 rounded-full bg-white/10 justify-center items-center"
          >
            <Feather name="search" size={20} color="white" />
          </TouchableOpacity>
          <HStack space="sm" className="items-center">
            <Feather name="moon" size={20} color="#79AED6" />
            <Text className="text-white font-vazirBold text-lg">خواب آرام</Text>
          </HStack>
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
          >
            <View className="w-6 h-6" />
          </TouchableOpacity>
        </HStack>
      </LinearGradient>
    );
  }
);

// ========== کامپوننت مجزا برای بخش نکات ==========
const TipsSection = React.memo(() => {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width, 0), [width]);

  return (
    <View className="mx-5 mt-8 mb-40">
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tipsGradient}
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
              قبل از خواب از صفحه نمایش استفاده نکنید و محیطی آرام برای خود
              ایجاد کنید
            </Text>
          </View>
        </HStack>
      </LinearGradient>
    </View>
  );
});

// ========== کامپوننت مجزا برای سکشن قصه‌ها ==========
const StoriesSection = React.memo(
  ({
    data,
    isLoading,
    onSeeAll,
  }: {
    data: any[];
    isLoading: boolean;
    onSeeAll: () => void;
  }) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const CARD_WIDTH = SCREEN_WIDTH - 60;
    const styles = useMemo(() => createStyles(CARD_WIDTH, 0), [CARD_WIDTH]);

    const skeletonData = useMemo(() => [1, 2], []);
    const renderSkeleton = useCallback(
      () => (
        <HStack space="md" className="px-3">
          {skeletonData.map((item) => (
            <Skeleton key={item} style={styles.skeletonStory} />
          ))}
        </HStack>
      ),
      [styles.skeletonStory]
    );

    if (data.length === 0 && !isLoading) return null;

    return (
      <VStack space="md" className="mt-2">
        <SectionHeader
          title="قصه‌های شب"
          icon={<MaterialIcons name="auto-stories" size={22} color="#79AED6" />}
          onSeeAll={onSeeAll}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString() || `story-${item.title}`}
          renderItem={({ item, index }) => (
            <StoryCard item={item} index={index} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + 16,
            offset: (CARD_WIDTH + 16) * index,
            index,
          })}
          ListEmptyComponent={isLoading ? renderSkeleton : null}
        />
      </VStack>
    );
  }
);

// ========== کامپوننت مجزا برای سکشن مدیتیشن‌های خواب ==========
const SleepMeditationsSection = React.memo(
  ({
    data,
    isLoading,
    onSeeAll,
  }: {
    data: any[];
    isLoading: boolean;
    onSeeAll: () => void;
  }) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const SMALL_CARD_WIDTH = 192;
    const styles = useMemo(
      () => createStyles(0, SMALL_CARD_WIDTH),
      [SMALL_CARD_WIDTH]
    );

    const skeletonData = useMemo(() => [1, 2, 3], []);
    const renderSkeleton = useCallback(
      () => (
        <HStack space="md" className="px-3">
          {skeletonData.map((item) => (
            <Skeleton key={item} style={styles.skeletonSmall} />
          ))}
        </HStack>
      ),
      [styles.skeletonSmall]
    );

    if (data.length === 0 && !isLoading) return null;

    return (
      <VStack space="lg" className="mt-6">
        <SectionHeader
          title="مدیتیشن‌های خواب"
          icon={<Feather name="moon" size={22} color="#79AED6" />}
          onSeeAll={onSeeAll}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString() || `sleep-${item.title}`}
          renderItem={({ item, index }) => (
            <SleepCourseCard index={index} item={item} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(_, index) => ({
            length: SMALL_CARD_WIDTH + 16,
            offset: (SMALL_CARD_WIDTH + 16) * index,
            index,
          })}
          ListEmptyComponent={isLoading ? renderSkeleton : null}
        />
      </VStack>
    );
  }
);

// ========== کامپوننت مجزا برای سکشن موسیقی خواب ==========
const SleepMusicSection = React.memo(
  ({
    data,
    isLoading,
    onSeeAll,
  }: {
    data: any[];
    isLoading: boolean;
    onSeeAll: () => void;
  }) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const SMALL_CARD_WIDTH = 192;
    const styles = useMemo(
      () => createStyles(0, SMALL_CARD_WIDTH),
      [SMALL_CARD_WIDTH]
    );

    const skeletonData = useMemo(() => [1, 2, 3], []);
    const renderSkeleton = useCallback(
      () => (
        <HStack space="md" className="px-3">
          {skeletonData.map((item) => (
            <Skeleton key={item} style={styles.skeletonSmall} />
          ))}
        </HStack>
      ),
      [styles.skeletonSmall]
    );

    if (data.length === 0 && !isLoading) return null;

    return (
      <VStack space="lg" className="mt-6">
        <SectionHeader
          title="آهنگ‌های خواب"
          icon={<Ionicons name="musical-notes" size={22} color="#79AED6" />}
          onSeeAll={onSeeAll}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString() || `music-${item.title}`}
          renderItem={({ item, index }) => (
            <SleepCourseCard index={index} item={item} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(_, index) => ({
            length: SMALL_CARD_WIDTH + 16,
            offset: (SMALL_CARD_WIDTH + 16) * index,
            index,
          })}
          ListEmptyComponent={isLoading ? renderSkeleton : null}
        />
      </VStack>
    );
  }
);

// ========== کامپوننت اصلی ==========
const Sleep = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);

  // استخراج دیتا با useMemo
  const sleepMusics = useMemo(
    () => exploreData?.meditations?.sleepMusic || [],
    [exploreData?.meditations?.sleepMusic]
  );
  const sleepMedias = useMemo(
    () => exploreData?.meditations?.sleep || [],
    [exploreData?.meditations?.sleep]
  );
  const sleepStories = useMemo(
    () => exploreData?.meditations?.story || [],
    [exploreData?.meditations?.story]
  );

  // هندلرهای نویگیشن با useCallback
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSearch = useCallback(() => {
    router.push("/explore/search-page");
  }, []);

  const handleSeeAllStories = useCallback(() => {
    router.push({
      pathname: "/(tabs)/sleep/all-musics",
      params: { type: "story" },
    });
  }, []);

  const handleSeeAllSleep = useCallback(() => {
    router.push({
      pathname: "/(tabs)/sleep/all-musics",
      params: { type: "sleep" },
    });
  }, []);

  const handleSeeAllMusic = useCallback(() => {
    router.push({
      pathname: "/(tabs)/sleep/all-musics",
      params: { type: "sleep-music" },
    });
  }, []);

  // رفرنس ثابت برای بخش نکات (برای جلوگیری از unmount/remount)
  const tipsElement = useMemo(() => <TipsSection />, []);

  // آرایه داده برای FlatList اصلی
  const sectionsData = useMemo(() => {
    const result: { id: string; component: React.ReactElement }[] = [];

    if (sleepStories.length > 0 || isLoading) {
      result.push({
        id: "stories",
        component: (
          <StoriesSection
            data={sleepStories}
            isLoading={isLoading}
            onSeeAll={handleSeeAllStories}
          />
        ),
      });
    }

    if (sleepMedias.length > 0 || isLoading) {
      result.push({
        id: "sleepMeditations",
        component: (
          <SleepMeditationsSection
            data={sleepMedias}
            isLoading={isLoading}
            onSeeAll={handleSeeAllSleep}
          />
        ),
      });
    }

    if (sleepMusics.length > 0 || isLoading) {
      result.push({
        id: "sleepMusic",
        component: (
          <SleepMusicSection
            data={sleepMusics}
            isLoading={isLoading}
            onSeeAll={handleSeeAllMusic}
          />
        ),
      });
    }

    result.push({
      id: "tips",
      component: tipsElement,
    });

    return result;
  }, [
    sleepStories,
    sleepMedias,
    sleepMusics,
    isLoading,
    handleSeeAllStories,
    handleSeeAllSleep,
    handleSeeAllMusic,
    tipsElement,
  ]);

  return (
    <LinearGradient
      colors={["#16213e", "#0a0a0f", "#1a1a2e"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={["top"]} className="flex-1 mb-16 bg-transparent">
        <FlatList
          data={sectionsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item.component}
          ListHeaderComponent={
            <MainHeader onSearch={handleSearch} onBack={handleBack} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          initialNumToRender={3}
          maxToRenderPerBatch={2}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default React.memo(Sleep);
