import MoodCard from "@/components/home/mood-card";
import RateAppSheet from "@/components/home/rate-act";
import Recommends from "@/components/home/recommends";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useFocusEffect } from "@react-navigation/native"; // 👈 اضافه کن
import React, { useCallback, useState } from "react";
import { BackHandler, ScrollView } from "react-native";

const Index = () => {
  const asked = useAppSelector((state) => state.initialize.isCommented);
  const [showRateModal, setShowRateModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (asked) {
          // کاربر قبلاً امتیاز داده یا رد کرده → اجازه خروج بده
          return false;
        }
        // کاربر هنوز امتیاز نداده → شیت امتیاز نشون بده
        setShowRateModal(true);
        return true; // مانع خروج بشه
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => sub.remove();
    }, [asked])
  );

  return (
    <ScrollView className="flex-1 bg-white ">
      <VStack className="flex-1 bg-white mb-20">
        <VStack className="w-full items-center justify-center px-5 py-2">
          <MoodCard />
        </VStack>

        <VStack space="md" className="my-5 px-5">
          <HStack className="items-center justify-between">
            <Text className="text-typography-400 text-sm"> </Text>
            <Text className="font-vazirBold text-xl">روانشناس من</Text>
          </HStack>
          <TestCard />
        </VStack>

        <VStack space="lg" className="mt-2">
          <HStack className="items-center justify-between mx-5">
            <Text className="text-typography-400 text-sm"> </Text>
            <Text className="font-vazirBold text-xl">پیشنهادها برای شما</Text>
          </HStack>
          <Recommends />
        </VStack>
      </VStack>

      <RateAppSheet isOpen={showRateModal} onClose={() => setShowRateModal(false)} />
    </ScrollView>
  );
};

export default React.memo(Index);
