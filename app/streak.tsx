import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetActivityQuery, useGetMoodQuery } from "@/services/mood/mood-adapter";
import { toPersianDigits } from "@/utils/persian";
import LottieView from "lottie-react-native";
import moment from "moment-timezone";
import React from "react";
import { StyleSheet } from "react-native";

const Streak = () => {
  const animationRef = React.useRef<LottieView>(null);
  const { data, isLoading: isMoodLoading } = useGetMoodQuery({ page: 1, limit: 30 });
  const { data: activity, isLoading: isActivityLoading } = useGetActivityQuery(null);

  const weeks = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const toPersianIndex = (day: number) => (day === 6 ? 0 : day + 1);

  const isLoading = isMoodLoading || isActivityLoading;

  if (isLoading) {
    return (
      <VStack space="lg" className="flex-1 justify-center items-center bg-white">
        {/* Animation skeleton */}
        <Skeleton variant="sharp" className="h-[200px] w-[200px] rounded-2xl absolute top-[10%]" />

        {/* Big number skeleton */}
        <SkeletonText _lines={1} className="h-10 w-24 mt-48 mb-6" />

        {/* Grid skeleton */}
        <VStack space="md">
          {[...Array(3)].map((_, rowIndex) => (
            <HStack key={rowIndex} className="flex-row-reverse justify-center items-center">
              {[...Array(7)].map((_, colIndex) => (
                <Skeleton key={colIndex} variant="circular" className="h-10 w-10 mx-1" />
              ))}
            </HStack>
          ))}
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack space="4xl" className="flex-1 justify-center items-center bg-white">
      <LottieView
        ref={animationRef}
        source={require("@/assets/animations/Seedling.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />

      <Text style={{ lineHeight: 80 }} className="text-6xl   font-vazirBold text-primary-600 ">
        {toPersianDigits(data?.data.totalMoodDays || 0)}
      </Text>

      <VStack space="md">
        {activity?.data?.map((week: any, weekIndex: number) => (
          <HStack key={weekIndex} className="flex-row-reverse justify-center items-center">
            {week.map((day: any) => {
              const gregorianDay = moment(day.date, "YYYY-MM-DD").day();
              const persianIndex = toPersianIndex(gregorianDay);
              const persianLabel = weeks[persianIndex];

              return (
                <VStack className="items-center" space="sm" key={day.date}>
                  {weekIndex === 0 && <Text className="text-sm font-vazir text-primary-700">{persianLabel}</Text>}
                  <VStack className={`p-2 rounded-full mx-1 ${day.active ? "bg-success-500" : "bg-gray-200"}`}>
                    <Text className="text-center text-lg">{day.active ? "🌱" : "⚪"}</Text>
                  </VStack>
                </VStack>
              );
            })}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default Streak;

const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
  },
});
