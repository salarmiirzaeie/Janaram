import AnalyzeModal from "@/components/chat/analyze-modal";
import MinimalChart from "@/components/home/minimal-chart";
import MoodBarChart from "@/components/reports/mood-bar-chart";
import MoodLogger from "@/components/reports/moodLogger";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetMoodReportQuery } from "@/services/report/report-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { moods as moodsEmoji, prepareBarData, prepareLineDataForLastMonth } from "@/utils/mood";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, Image, StatusBar, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { colors } from "./(tabs)/psychologist";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 64;

// ========== کامپوننت مجزا برای دکمه تحلیل ==========
const ActionButtons = React.memo(
  ({
    isProActive,
    onAnalyzePersonality,
    onTests,
  }: {
    isProActive: boolean;
    onAnalyzePersonality: () => void;
    onTests: () => void;
  }) => {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#F9F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <TouchableOpacity onPress={onTests} activeOpacity={0.8} className="mt-3">
          <LinearGradient
            colors={["#9966CC", "#FF9966"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <AntDesign name="question-circle" size={20} color="white" />
            <Text className="text-white font-vazirBold text-base">تست‌های خودشناسی</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  },
);

// ========== کامپوننت مجزا برای چارت روند ==========
const MoodTrendChart = React.memo(({ lineData }: { lineData: any }) => {
  if (!lineData?.datasets?.[0]?.data?.length) {
    return (
      <View className="py-12 items-center">
        <Feather name="bar-chart-2" size={48} color="#CCC" />
        <Text className="text-center text-gray-400 font-vazir mt-2">موردی برای نمایش وجود ندارد</Text>
      </View>
    );
  }

  return (
    <View className="relative">
      <View className="absolute z-50 top-0 left-2 h-full">
        {moodsEmoji.map((label: any) => (
          <Image key={label.label} source={label.emoji} resizeMode="cover" className="h-5 mb-1 w-5" />
        ))}
      </View>
      <LineChart
        data={lineData}
        width={CHART_WIDTH}
        height={220}
        withInnerLines={false}
        withOuterLines={false}
        yAxisInterval={1}
        bezier
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(121, 174, 214, ${opacity})`,
          labelColor: (opacity = 1) => "transparent",
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#9966CC",
          },
          style: {
            borderRadius: 16,
          },
        }}
        withDots={true}
        style={{
          borderRadius: 16,
          marginLeft: -20,
        }}
      />
    </View>
  );
});

// ========== کامپوننت مجزا برای کارت توزیع احساسات ==========
const MoodDistributionCard = React.memo(({ moodsData }: { moodsData: any[] }) => (
  <LinearGradient
    colors={["#FFFFFF", "#F9F9FF"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: 24,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <HStack className="items-center justify-between mb-4">
      <View className="bg-primary-100 rounded-full px-3 py-1">
        <Text className="text-primary-600 font-vazir text-xs">توزیع احساسات</Text>
      </View>
      <HStack space="sm" className="items-center">
        <Ionicons name="pie-chart" size={18} color="#FF9966" />
        <Text className="font-vazirBold text-primary-800 text-lg">سهم هر حس از کل</Text>
      </HStack>
    </HStack>
    <MinimalChart moods={moodsData} />
  </LinearGradient>
));

// ========== کامپوننت مجزا برای کارت بیشترین احساسات ==========
const MoodFrequencyCard = React.memo(({ barData }: { barData: any }) => (
  <LinearGradient
    colors={["#FFFFFF", "#F9F9FF"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: 24,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <HStack className="items-center justify-between mb-4">
      <View className="bg-primary-100 rounded-full px-3 py-1">
        <Text className="text-primary-600 font-vazir text-xs">بیشترین احساسات</Text>
      </View>
      <HStack space="sm" className="items-center">
        <Feather name="bar-chart" size={18} color="#79AED6" />
        <Text className="font-vazirBold text-primary-800 text-lg">بیشتر چه حالی داشتم</Text>
      </HStack>
    </HStack>
    <MoodBarChart lineData={barData} />
  </LinearGradient>
));

// ========== کامپوننت اصلی ==========
const Reports = () => {
  const { data, isLoading } = useGetMoodReportQuery({ page: 1, limit: 30 });
  const { data: plans } = usePlansQuery(null);
  const dispatch = useDispatch();
  const [analyze, showAnalyze] = useState(false);

  // ========== محاسبات با useMemo ==========
  const moodsData = useMemo(() => data?.data || [], [data?.data]);
  const barData = useMemo(() => prepareBarData(moodsData), [moodsData]);
  const lineData = useMemo(() => prepareLineDataForLastMonth(moodsData), [moodsData]);

  const proPlan = useMemo(() => plans?.data?.plans?.find((plan) => plan.name === "unlimited"), [plans?.data?.plans]);
  const isProActive = useMemo(() => proPlan?.isActive || false, [proPlan?.isActive]);

  // ========== هندلرها با useCallback ==========
  const handleAnalyzeMyPersonality = useCallback(() => {
    showAnalyze(true);
  }, []);

  const handleOpenNotProModal = useCallback(() => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "ابزار تحلیل شخصیت من مخصوص کاربران Pro می‌باشد.",
        showNotProModal: true,
      },
    });
  }, [dispatch]);

  const handleAnalyzePress = useCallback(() => {
    if (!isProActive) {
      handleOpenNotProModal();
    } else {
      handleAnalyzeMyPersonality();
    }
  }, [isProActive, handleOpenNotProModal, handleAnalyzeMyPersonality]);

  const handleTestsPress = useCallback(() => {
    router.push("/tests");
  }, []);

  const handleCloseAnalyze = useCallback(() => {
    showAnalyze(false);
  }, []);

  // ========== سکشن‌ها برای FlatList (بدون انیمیشن) ==========
  const sections = useMemo(() => {
    return [
      {
        id: "actions",
        component: (
          <ActionButtons
            isProActive={isProActive}
            onAnalyzePersonality={handleAnalyzePress}
            onTests={handleTestsPress}
          />
        ),
      },
      {
        id: "trend",
        component: (
          <LinearGradient
            colors={["#FFFFFF", "#F9F9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <HStack className="items-center justify-between mb-4">
              <View className="bg-primary-100 rounded-full px-3 py-1">
                <Text className="text-primary-600 font-vazir text-xs">۳۰ روز اخیر</Text>
              </View>
              <HStack space="sm" className="items-center">
                <Feather name="trending-up" size={18} color="#79AED6" />
                <Text className="font-vazirBold text-primary-800 text-lg">روند حال من</Text>
              </HStack>
            </HStack>
            <View className="items-center justify-center mt-2">
              <MoodTrendChart lineData={lineData} />
            </View>
          </LinearGradient>
        ),
      },
      {
        id: "distribution",
        component: <MoodDistributionCard moodsData={moodsData} />,
      },
      {
        id: "frequency",
        component: <MoodFrequencyCard barData={barData} />,
      },
      {
        id: "logger",
        component: <MoodLogger />,
      },
    ];
  }, [isProActive, handleAnalyzePress, handleTestsPress, lineData, moodsData, barData]);

  // ========== رندر هر سکشن (بدون انیمیشن) ==========
  const renderSection = useCallback(({ item }: { item: (typeof sections)[0] }) => {
    return (
      <VStack space="lg" className="mb-4">
        {item.component}
      </VStack>
    );
  }, []);

  if (isLoading) {
    return (
      <LinearGradient colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]} style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center h-96">
          <Spinner size="large" color="#79AED6" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[100],
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.gray[100],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            fontFamily: "vazirBold",
            color: colors.gray[800],
          }}
        >
          حال من
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {analyze && <AnalyzeModal visible={analyze} onClose={handleCloseAnalyze} />}
    </SafeAreaView>
  );
};

export default React.memo(Reports);
