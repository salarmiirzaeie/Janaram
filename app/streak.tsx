import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useGetActivityQuery,
  useGetMoodQuery,
} from "@/services/mood/mood-adapter";
import { toPersianDigits } from "@/utils/persian";
import { Feather, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import moment from "moment-timezone";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const Streak = () => {
  const animationRef = React.useRef<LottieView>(null);
  const { data, isLoading: isMoodLoading } = useGetMoodQuery({
    page: 1,
    limit: 30,
  });
  const { data: activity, isLoading: isActivityLoading } =
    useGetActivityQuery(null);

  const weeks = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const toPersianIndex = (day: number) => (day === 6 ? 0 : day + 1);

  const isLoading = isMoodLoading || isActivityLoading;
  const streakCount = data?.data.totalMoodDays || 0;

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          {/* Animation skeleton */}
          <Skeleton
            variant="sharp"
            className="h-[200px] w-[200px] rounded-2xl"
          />

          {/* Big number skeleton */}
          <SkeletonText _lines={1} className="h-12 w-28 mt-8 mb-6" />

          {/* Grid skeleton */}
          <VStack space="md" className="mt-4">
            {[...Array(3)].map((_, rowIndex) => (
              <HStack
                key={rowIndex}
                className="flex-row-reverse justify-center items-center"
              >
                {[...Array(7)].map((_, colIndex) => (
                  <Skeleton
                    key={colIndex}
                    variant="circular"
                    className="h-10 w-10 mx-1 rounded-full"
                  />
                ))}
              </HStack>
            ))}
          </VStack>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack className="flex-1 justify-center items-center py-8">
          {/* Animation */}
          <Animated.View entering={FadeIn.duration(600)}>
            <View className="relative">
              <LottieView
                ref={animationRef}
                source={require("@/assets/animations/Seedling.json")}
                autoPlay
                loop={false}
                style={styles.animation}
              />
              {/* Decorative sparkles */}
              <View className="absolute -top-2 -right-2">
                <Ionicons name="sparkles" size={24} color="#FF9966" />
              </View>
            </View>
          </Animated.View>

          {/* Streak Counter */}
          <Animated.View entering={FadeInUp.duration(600).delay(100)}>
            <View className="items-center mb-4">
              <Text className="text-primary-600 font-vazir text-base mb-2">
                رکورد روزهای متوالی
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-7xl font-vazirBold text-primary-700">
                  {toPersianDigits(streakCount)}
                </Text>
                <Text className="text-2xl font-vazirBold text-primary-400">
                  روز
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mt-2 bg-primary-100 px-3 py-1 rounded-full">
                <Feather name="award" size={14} color="#FF9966" />
                <Text className="text-primary-600 font-vazir text-xs">
                  در حال رشد
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Activity Calendar */}
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <View className="mt-6 px-4">
              <HStack className="items-center justify-center mb-4 gap-4">
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 rounded-full bg-success-500" />
                  <Text className="text-gray-500 font-vazir text-xs">فعال</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 rounded-full bg-gray-200" />
                  <Text className="text-gray-500 font-vazir text-xs">
                    غیرفعال
                  </Text>
                </View>
              </HStack>

              <View className="bg-white rounded-2xl p-4 shadow-lg">
                {activity?.data?.map((week: any, weekIndex: number) => (
                  <HStack
                    key={weekIndex}
                    className="flex-row-reverse justify-center items-center mb-3"
                  >
                    {week.map((day: any, dayIndex: number) => {
                      const gregorianDay = moment(day.date, "YYYY-MM-DD").day();
                      const persianIndex = toPersianIndex(gregorianDay);
                      const persianLabel = weeks[persianIndex];
                      const isActive = day.active;

                      return (
                        <VStack
                          className="items-center mx-1"
                          space="xs"
                          key={day.date}
                        >
                          {weekIndex === 0 && (
                            <Text className="text-xs font-vazir text-primary-500 mb-1">
                              {persianLabel}
                            </Text>
                          )}
                          <Animated.View
                            entering={FadeInUp.duration(300).delay(
                              weekIndex * 50 + dayIndex * 20
                            )}
                          >
                            <LinearGradient
                              colors={
                                isActive
                                  ? ["#66BB6A", "#4CAF50"]
                                  : ["#E0E0E0", "#D0D0D0"]
                              }
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                borderRadius: 30,
                                padding: 10,
                                width: 44,
                                height: 44,
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: isActive ? "#66BB6A" : "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isActive ? 0.3 : 0.05,
                                shadowRadius: 4,
                                elevation: isActive ? 3 : 0,
                              }}
                            >
                              {isActive ? (
                                <Feather name="check" size={20} color="white" />
                              ) : (
                                <Feather
                                  name="circle"
                                  size={16}
                                  color="#BDBDBD"
                                />
                              )}
                            </LinearGradient>
                          </Animated.View>
                        </VStack>
                      );
                    })}
                  </HStack>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Motivational Message */}
          <Animated.View entering={FadeInUp.duration(600).delay(400)}>
            <View className="mt-8 px-6">
              <LinearGradient
                colors={["#F5F0FA", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E9EDF2",
                }}
              >
                <Text className="text-primary-600 font-vazirBold text-base text-center mb-1">
                  {streakCount === 0 && "💪 شروع کن"}
                  {streakCount > 0 && streakCount < 7 && "🌱 عالی ادامه بده"}
                  {streakCount >= 7 && streakCount < 30 && "🔥 تو آتشی!"}
                  {streakCount >= 30 && "👑 افسانه‌ای!"}
                </Text>
                <Text className="text-gray-500 font-vazir text-xs text-center">
                  {streakCount === 0 && "هر روز می‌تونه شروع یه عادت جدید باشه"}
                  {streakCount > 0 &&
                    streakCount < 7 &&
                    "با همین روند به عادت روزانه تبدیلش کن"}
                  {streakCount >= 7 &&
                    streakCount < 30 &&
                    "۳۰ روز تا تبدیل شدن به یه عادت پایدار"}
                  {streakCount >= 30 && "۳۰ روز گذشته‌ات شگفت‌انگیز بوده!"}
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
        </VStack>
      </ScrollView>
    </LinearGradient>
  );
};

export default Streak;

const styles = StyleSheet.create({
  animation: {
    width: 160,
    height: 160,
  },
});
