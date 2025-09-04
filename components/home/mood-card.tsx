import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { toPersianDigits } from "@/utils/persian";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
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

  return (
    <VStack className="mt-4 w-full items-center flex-1">
      {isLoading ? (
        <Skeleton className="w-full h-60 rounded-3xl px-5 py-4 " />
      ) : data?.data?.status === "no-mood" ? (
        <View className="shadow-2xl rounded-full p-2 bg-primary-100">
          <Pressable
            onPress={() => setMoodSheet(true)}
            className="w-60 h-60 shadow-xl py-4 rounded-full bg-primary-400 items-center justify-center"
          >
            <Image resizeMode="contain" source={require("@/assets/emojis/hi.png")} className="w-16 h-16" />
            <Text className="text-white mt-4 text-lg font-vazirBold">امروز چه حسی داری؟</Text>
          </Pressable>
        </View>
      ) : (
        <View className="w-full h-60 rounded-3xl px-5 py-4 bg-primary-300 shadow-md">
          <HStack className="justify-between items-center">
            <HStack space="md" className="items-center">
              <Text className="text-xl font-vazirBold text-primary-800">
                {toPersianDigits(data?.data.completedExercises || 0)} /{" "}
                {toPersianDigits(data?.data.totalExercises || 0)}
              </Text>
              {data?.data.progressPercent === 100 && (
                <Feather name="check-circle" size={24} color="#66BB6A" /> // success-500
              )}
            </HStack>
            <Text className="text-xl font-vazirBold text-primary-800">پیشرفت امروز</Text>
          </HStack>

          <Progress
            value={data?.data.progressPercent}
            size="md"
            orientation="horizontal"
            className="w-full my-4 rounded-full bg-primary-200"
          >
            <ProgressFilledTrack className={data?.data.progressPercent === 100 ? "bg-success-500" : "bg-primary-500"} />
          </Progress>

          <VStack
            className={`rounded-2xl border-1 py-4 flex-1 ${
              data?.data.progressPercent === 100
                ? "bg-calm-300 border-success-500"
                : "bg-primary-100 border-primary-500"
            }`}
          >
            <Pressable
              className="flex-1 justify-between items-center"
              onPress={() => router.navigate({ pathname: "/train" })}
            >
              <Text className="font-vazirBold text-lg text-primary-800">
                {data?.data.progressPercent === 100
                  ? "تبریک !"
                  : data?.data.progressPercent === 0
                  ? "شروع کن"
                  : "ادامه"}
              </Text>

              <Text className="font-vazir text-sm text-primary-700 text-center mt-1">
                {data?.data.progressPercent !== 100
                  ? `${toPersianDigits(
                      (data?.data.totalExercises || 0) - (data?.data.completedExercises || 0)
                    )} تمرین برای تکمیل روز باقی مانده`
                  : "همه تمرین های امروز تکمیل شد"}
              </Text>

              <Button
                onPress={() => router.navigate({ pathname: "/train" })}
                size="sm"
                className={data?.data.progressPercent === 100 ? "bg-success-500 mt-2" : "bg-primary-500 mt-2"}
              >
                {data?.data.progressPercent === 100 && (
                  <ButtonIcon as={(props) => <Feather {...props} size={12} color="white" name="check" />} />
                )}
                <ButtonText className="text-white font-vazirBold">
                  {data?.data.progressPercent === 100 ? "تمام شد" : data?.data.progressPercent === 0 ? "شروع" : "ادامه"}
                </ButtonText>
              </Button>
            </Pressable>
          </VStack>
        </View>
      )}

      <MoodAct handleStreakModal={handleStreakModal} isOpen={moodSheet} onClose={() => setMoodSheet(false)} />
      <StreakModal
        streakCount={data?.data.totalMoodDays || 0}
        showStreakModal={showStreakModal}
        onClose={() => setShowStreakModal(false)}
      />
    </VStack>
  );
};

export default MoodCard;
