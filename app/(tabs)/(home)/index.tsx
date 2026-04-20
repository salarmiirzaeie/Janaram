import MoodCard from "@/components/home/mood-card";
import PsychoCard from "@/components/home/psycho-card";
import RateAppSheet from "@/components/home/rate-act";
import Recommends from "@/components/home/recommends";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

// ========== کامپوننت مجزا برای آیتم دسترسی سریع ==========
const QuickAccessItem = React.memo(
  ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.route.pathname) {
            // For routes with params, use replace
            router.dismissTo({
              pathname: item.route.pathname,
              params: item.route.params,
            });
          } else {
            router.dismissTo(item.route as any);
          }
        }}
        activeOpacity={0.8}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={item.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingVertical: 12,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: item.color[0],
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <View className="mb-1.5">{item.icon}</View>
          <Text className="text-white font-vazirBold text-[11px] text-center">
            {item.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
);

// ========== کامپوننت مجزا برای بخش دسترسی سریع ==========
const QuickAccessGrid = React.memo(({ items }: { items: any[] }) => {
  return (
    <View className="px-5 mt-6">
      <View className="flex-row justify-between gap-2">
        {items.map((item, index) => (
          <QuickAccessItem key={item.id} item={item} index={index} />
        ))}
      </View>
    </View>
  );
});

// ========== کامپوننت اصلی ==========
const Home = () => {
  const asked = useAppSelector((state) => state.initialize.isCommented);
  const [showRateModal, setShowRateModal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // ========== هندلر بک هندلر ==========
  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       if (asked) {
  //         return false;
  //       }
  //       setShowRateModal(true);
  //       return true;
  //     };

  //     const sub = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       onBackPress
  //     );

  //     // فقط یک بار انیمیشن اجرا شود
  //     const timer = setTimeout(() => {
  //       setIsFirstLoad(false);
  //     }, 500);

  //     return () => {
  //       sub.remove();
  //       clearTimeout(timer);
  //     };
  //   }, [asked])
  // );

  // ========== useMemo برای آیتم‌های دسترسی سریع ==========
  const quickAccessItems = useMemo(
    () => [
      {
        id: 1,
        title: "آرامش",
        icon: <Feather name="wind" size={28} color="white" />,
        color: ["#79AED6", "#5E95BD"],
        route: {
          pathname: "/explore/all-files",
          params: { type: "calm", title: "آرامش" },
        },
      },

      {
        id: 3,
        title: "تست",
        icon: <FontAwesome5 name="clipboard-list" size={24} color="white" />,
        color: ["#FF9966", "#E6804D"],
        route: "/reports/tests",
      },
      {
        id: 4,
        title: "روانشناس",
        icon: <Ionicons name="people" size={28} color="white" />,
        color: ["#91A5BE", "#7A8BA8"],
        route: "/psychologist",
      },
      {
        id: 5,
        title: "خواب",
        icon: <Feather name="moon" size={28} color="white" />,
        color: ["#79AED6", "#9966CC"],
        route: "/sleep",
      },
      {
        id: 2,
        title: "تنفس",
        icon: <MaterialIcons name="air" size={28} color="white" />,
        color: ["#9966CC", "#804DB3"],
        route: "/breathings",
      },
      {
        id: 6,
        title: "بی کلام",
        icon: <Ionicons name="musical-notes" size={26} color="white" />,
        color: ["#9966CC", "#FF9966"],
        route: {
          pathname: "/explore/all-files",
          params: { type: "instrumental", title: "بی کلام" },
        },
      },
    ],
    []
  );

  // ========== هندلرها ==========
  const handleCloseRateModal = useCallback(() => {
    setShowRateModal(false);
  }, []);

  const handleNavigateToExplore = useCallback(() => {
    router.push("/explore");
  }, []);

  // ========== سکشن‌ها برای FlatList ==========
  const sections = useMemo(() => {
    const result = [];

    // Mood Card
    result.push({
      id: "mood",
      render: () => (
        <View className="w-full items-center justify-center px-5 py-2">
          <MoodCard />
        </View>
      ),
    });

    // Quick Access
    result.push({
      id: "quickAccess",
      render: () => <QuickAccessGrid items={quickAccessItems} />,
    });

    // Psychologist Section
    result.push({
      id: "psychologist",
      render: () => (
        <VStack space="md" className="mt-8 px-5">
          <HStack className="items-center justify-end">
            <HStack space="sm" className="items-center">
              <Text className="font-vazirBold text-primary-800 text-xl">
                روانشناس من
              </Text>
              <Ionicons name="people" size={22} color="#9966CC" />
            </HStack>
          </HStack>
          <PsychoCard />
        </VStack>
      ),
    });

    // Recommended Meditations
    result.push({
      id: "recommended",
      render: () => (
        <VStack space="lg" className="mt-8">
          <HStack className="items-center justify-between mx-5">
            <TouchableOpacity onPress={handleNavigateToExplore}>
              <HStack space="sm" className="items-center">
                <Text className="text-primary-600 text-sm font-vazir">
                  مشاهده همه
                </Text>
                <AntDesign name="left" size={14} color="#79AED6" />
              </HStack>
            </TouchableOpacity>
            <HStack space="sm" className="items-center">
              <Text className="font-vazirBold text-primary-800 text-xl">
                مدیتیشن های پیشنهادی
              </Text>
              <Feather name="wind" size={22} color="#79AED6" />
            </HStack>
          </HStack>
          <Recommends />
        </VStack>
      ),
    });

    // Self-awareness Test
    result.push({
      id: "test",
      render: () => (
        <VStack space="md" className="mt-4 mb-5 px-5">
          <HStack className="items-center justify-end">
            <HStack space="sm" className="items-center">
              <Text className="font-vazirBold text-primary-800 text-xl">
                تست خودشناسی
              </Text>
              <FontAwesome5 name="clipboard-list" size={20} color="#FF9966" />
            </HStack>
          </HStack>
          <TestCard />
        </VStack>
      ),
    });

    return result;
  }, [quickAccessItems, handleNavigateToExplore]);

  // ========== رندر هر سکشن با انیمیشن ==========
  const renderSection = useCallback(
    ({ item, index }: { item: (typeof sections)[0]; index: number }) => {
      const AnimationWrapper = isFirstLoad ? Animated.View : View;
      const animationProps = isFirstLoad
        ? {
            entering: FadeInUp.duration(600).delay(
              index === 0 ? 0 : 100 + index * 80
            ),
          }
        : {};

      // برای سکشن اول (mood) انیمیشن متفاوت
      if (index === 0 && isFirstLoad) {
        return (
          <Animated.View entering={FadeInUp.duration(600).springify()}>
            {item.render()}
          </Animated.View>
        );
      }

      return (
        <AnimationWrapper {...animationProps}>{item.render()}</AnimationWrapper>
      );
    },
    [isFirstLoad]
  );

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F0F6FA"]}
      style={{ flex: 1, paddingBottom: 80 }}
    >
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <RateAppSheet isOpen={showRateModal} onClose={handleCloseRateModal} />
    </LinearGradient>
  );
};

export default React.memo(Home);
