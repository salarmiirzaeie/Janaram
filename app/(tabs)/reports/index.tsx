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
import {
  moods as moodsEmoji,
  prepareBarData,
  prepareLineDataForLastMonth,
} from "@/utils/mood";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useDispatch } from "react-redux";

const { width } = Dimensions.get("window");

const Test = () => {
  const { data, isLoading } = useGetMoodReportQuery({ page: 1, limit: 30 });
  const moods = data?.data || [];
  const barData = prepareBarData(moods);
  const lineData = prepareLineDataForLastMonth(moods);
  const [analyze, showAnalyze] = useState(false);

  const dispatch = useDispatch();
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");

  const handleOpenNotProModal = () => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "ابزار تحلیل شخصیت من مخصوص کاربران Pro می‌باشد.",
        showNotProModal: true,
      },
    });
  };

  const handleAnalyzeMyPersonality = () => {
    showAnalyze(true);
  };

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center h-96">
            <Spinner size="large" color="#79AED6" />
          </View>
        ) : (
          <VStack space="lg" className="flex-1 p-4 mb-40 pt-6 ">
            {/* Action Buttons */}
            <Animated.View entering={FadeInUp.duration(600).delay(100)}>
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
                <TouchableOpacity
                  onPress={() => {
                    if (!proPlan?.isActive) {
                      handleOpenNotProModal();
                    } else {
                      handleAnalyzeMyPersonality();
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#79AED6", "#9966CC"]}
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
                    <AntDesign name="thunderbolt" size={20} color="white" />
                    <Text className="text-white font-vazirBold text-base">
                      تحلیل شخصیت من
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    router.push("/reports/tests");
                  }}
                  activeOpacity={0.8}
                  className="mt-3"
                >
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
                    <Text className="text-white font-vazirBold text-base">
                      تست‌های خودشناسی
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>

            {/* Mood Trend Chart */}
            <Animated.View entering={FadeInUp.duration(600).delay(200)}>
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
                    <Text className="text-primary-600 font-vazir text-xs">
                      ۳۰ روز اخیر
                    </Text>
                  </View>
                  <HStack space="sm" className="items-center">
                    <Feather name="trending-up" size={18} color="#79AED6" />
                    <Text className="font-vazirBold text-primary-800 text-lg">
                      روند حال من
                    </Text>
                  </HStack>
                </HStack>

                <View className="items-center justify-center mt-2">
                  {lineData?.datasets?.[0]?.data?.length > 0 ? (
                    <View className="relative">
                      {/* Emoji labels on Y-axis */}
                      <View className="absolute z-50 top-0 left-2 h-full  ">
                        {moodsEmoji.map((label: any) => (
                          <Image
                            key={label.label}
                            source={label.emoji}
                            resizeMode="cover"
                            className="h-5   mb-1 w-5"
                          />
                        ))}
                      </View>
                      <LineChart
                        data={lineData}
                        width={width - 64}
                        height={220}
                        withInnerLines={false}
                        withOuterLines={false}
                        yAxisInterval={1}
                        bezier
                        chartConfig={{
                          backgroundColor: "#fff",
                          backgroundGradientFrom: "#fff",
                          backgroundGradientTo: "#fff",
                          color: (opacity = 1) =>
                            `rgba(121, 174, 214, ${opacity})`,
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
                  ) : (
                    <View className="py-12 items-center">
                      <Feather name="bar-chart-2" size={48} color="#CCC" />
                      <Text className="text-center text-gray-400 font-vazir mt-2">
                        موردی برای نمایش وجود ندارد
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Mood Distribution */}
            <Animated.View entering={FadeInUp.duration(600).delay(300)}>
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
                    <Text className="text-primary-600 font-vazir text-xs">
                      توزیع احساسات
                    </Text>
                  </View>
                  <HStack space="sm" className="items-center">
                    <Ionicons name="pie-chart" size={18} color="#FF9966" />
                    <Text className="font-vazirBold text-primary-800 text-lg">
                      سهم هر حس از کل
                    </Text>
                  </HStack>
                </HStack>
                <MinimalChart moods={data?.data || []} />
              </LinearGradient>
            </Animated.View>

            {/* Mood Frequency Bar Chart */}
            <Animated.View entering={FadeInUp.duration(600).delay(400)}>
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
                    <Text className="text-primary-600 font-vazir text-xs">
                      بیشترین احساسات
                    </Text>
                  </View>
                  <HStack space="sm" className="items-center">
                    <Feather name="bar-chart" size={18} color="#79AED6" />
                    <Text className="font-vazirBold text-primary-800 text-lg">
                      بیشتر چه حالی داشتم
                    </Text>
                  </HStack>
                </HStack>
                <MoodBarChart lineData={barData} />
              </LinearGradient>
            </Animated.View>

            {/* Mood Logger */}
            <Animated.View entering={FadeInUp.duration(600).delay(500)}>
              <MoodLogger />
            </Animated.View>
          </VStack>
        )}
      </ScrollView>

      {analyze && (
        <AnalyzeModal visible={analyze} onClose={() => showAnalyze(false)} />
      )}
    </LinearGradient>
  );
};

export default React.memo(Test);
