import { useAppSelector } from "@/hooks/useAppSelector";
import { useCustomToast } from "@/hooks/useToast";
import { router } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const TestCard: React.FC = (props) => {
  const toast = useCustomToast();
  const notificationCount = useAppSelector((state) => state.notification.unReadNotifications);
  return (
    <Pressable
      className="shadow-md bg-white rounded-full"
      onPress={() => {
        router.navigate("/chat-bot");
      }}
    >
      {/* شماره بالای کارت */}
      {notificationCount > 0 && (
        <VStack className="absolute bg-primary-500 -top-1.5 w-7 h-7 justify-center items-center rounded-full z-50 -left-1.5">
          <Text className="font-vazirBold text-md text-white">{notificationCount}</Text>
        </VStack>
      )}

      {/* بدنه کارت */}
      <HStack className="py-5 pr-5 rounded-3xl justify-between w-full bg-secondary-300 shadow">
        <VStack className="flex-1 justify-center items-center">
          <Image source={require("@/assets/images/bot-vector.png")} className="w-44 h-28" alt="test" />
        </VStack>

        <VStack space="xl" className="flex-1 justify-between">
          <VStack space="md">
            <Text className="font-vazirBold text-md text-right text-white">روانشناس هوش مصنوعی</Text>
            <Text className="font-vazir text-xs text-right text-white">
              به راحتی احساسات خود را بیان کن و راهنمایی حرفه‌ای دریافت کن.
            </Text>
          </VStack>

          <Button
            className="bg-primary-500"
            onPress={() => {
              router.navigate("/chat-bot");
            }}
          >
            <ButtonText>شروع گفتگو</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Pressable>
  );
};

export default TestCard;
