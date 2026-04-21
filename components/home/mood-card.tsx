import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { toPersianDigits } from "@/utils/persian";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HStack } from "../ui/hstack";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";
import MoodAct from "./mood-act";
import StreakModal from "./streak-modal";

const MoodCard = () => {
  const [moodSheet, setMoodSheet] = useState(false);
  const { data, isLoading } = useGetMoodQuery(null, {});
  const [showStreakModal, setShowStreakModal] = useState(false);
  const handleStreakModal = () => setShowStreakModal(true);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isComplete = data?.data.progressPercent === 100;
  const isZero = data?.data.progressPercent === 0;

  // Fixed height container to prevent layout shift
  return (
    <VStack className="mt-4 w-full items-center">
      {isLoading ? (
        <View className="w-full h-56">
          <Skeleton className="w-full h-full rounded-3xl" />
        </View>
      ) : data?.data?.status === "no-mood" ? (
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          className="items-center justify-center h-56"
        >
          <TouchableOpacity
            onPress={() => setMoodSheet(true)}
            activeOpacity={0.9}
            className="items-center justify-center"
          >
            <LinearGradient
              colors={["#79AED6", "#87B7D7", "#9966CC"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#79AED6",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Image
                resizeMode="contain"
                source={require("@/assets/emojis/hi.png")}
                className="w-16 h-16"
              />
              <Text className="text-white mt-4 text-base font-vazirBold text-center px-4">
                امروز چه حسی داری؟
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          className="w-full"
        >
          <LinearGradient
            colors={["#FFFFFF", "#F0F6FA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 28,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* Header Section */}
            <HStack className="justify-between items-center">
              <HStack space="md" className="items-center">
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl font-vazirBold text-primary-600">
                    {data?.data.completedExercises || 0}
                  </Text>
                  <Text className="text-xl font-vazir text-primary-400">/</Text>
                  <Text className="text-xl font-vazir text-primary-400">
                    {data?.data.totalExercises || 0}
                  </Text>
                </View>
                {isComplete && (
                  <Animated.View entering={FadeIn.duration(300)}>
                    <View className="bg-secondary-800 rounded-full p-1">
                      <Feather name="check-circle" size={20} color="white" />
                    </View>
                  </Animated.View>
                )}
              </HStack>
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-vazirBold text-primary-800">
                  پیشرفت امروز
                </Text>
                <Ionicons name="trending-up" size={20} color="#79AED6" />
              </View>
            </HStack>

            {/* Progress Bar */}
            <View className="my-4">
              <Progress
                value={data?.data.progressPercent}
                size="md"
                orientation="horizontal"
                className="w-full rounded-full bg-primary-100"
              >
                <LinearGradient
                  colors={
                    isComplete ? ["#663399", "#4D1A80"] : ["#79AED6", "#9966CC"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <ProgressFilledTrack
                    className={
                      isComplete ? "bg-secondary-800" : "bg-transparent"
                    }
                  />
                </LinearGradient>
              </Progress>
              <Text className="text-right text-primary-500 text-md font-vazir mt-1">
                {toPersianDigits(Math.round(data?.data.progressPercent || 0))}%
              </Text>
            </View>

            {/* Action Card */}
            <TouchableOpacity
              onPress={() => router.navigate({ pathname: "/train" })}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Animated.View style={animatedStyle}>
                <LinearGradient
                  colors={
                    isComplete
                      ? ["#663399", "#4D1A80"]
                      : isZero
                      ? ["#91A5BE", "#7A8BA8"]
                      : ["#79AED6", "#9966CC"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20,
                    padding: 16,
                  }}
                >
                  <HStack className="justify-between items-center">
                    <View className="flex-1">
                      <Text className="font-vazirBold text-xl text-white mb-1 text-right">
                        {isComplete
                          ? "🎉 تبریک !"
                          : isZero
                          ? "✨ شروع کن"
                          : "💪 ادامه بده"}
                      </Text>
                      <Text className="font-vazir text-sm text-white/90 text-right">
                        {!isComplete
                          ? `${
                              (data?.data.totalExercises || 0) -
                              (data?.data.completedExercises || 0)
                            } تمرین برای تکمیل روز باقی مانده`
                          : "همه تمرین های امروز تکمیل شد"}
                      </Text>
                    </View>
                    <View className="bg-white/20 rounded-full p-3 ml-2">
                      <Ionicons
                        name={
                          isComplete
                            ? "checkmark-done"
                            : isZero
                            ? "play"
                            : "arrow-forward"
                        }
                        size={24}
                        color="white"
                      />
                    </View>
                  </HStack>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}

      {moodSheet && (
        <MoodAct
          handleStreakModal={handleStreakModal}
          isOpen={moodSheet}
          onClose={() => setMoodSheet(false)}
        />
      )}
      {showStreakModal && (
        <StreakModal
          streakCount={data?.data.totalMoodDays || 0}
          showStreakModal={showStreakModal}
          onClose={() => setShowStreakModal(false)}
        />
      )}
    </VStack>
  );
};

export default MoodCard;
