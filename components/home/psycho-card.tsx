import { useAppSelector } from "@/hooks/useAppSelector";
import { router } from "expo-router";
import React, { memo } from "react";
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const PsychoCard: React.FC = (props) => {
  const notificationCount = useAppSelector(
    (state) => state.notification.unReadNotifications
  );

  return (
    <Pressable
      className=" rounded-full"
      onPress={() => {
        router.navigate("/chat-bot");
      }}
    >
      {/* شماره بالای کارت */}
      {notificationCount > 0 && (
        <VStack className="absolute bg-primary-500 -top-1.5 w-7 h-7 justify-center items-center rounded-full z-50 -left-1.5">
          <Text className="font-vazirBold text-md text-white">
            {notificationCount}
          </Text>
        </VStack>
      )}

      {/* بدنه کارت */}
      <LinearGradient
        colors={["#AD85D7", "#EBE0F5"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ borderRadius: 20 }}
      >
        <HStack className="py-3 pr-5 rounded-3xl justify-between w-full ">
          <VStack className="flex-1 justify-center items-center">
            <Image
              source={require("@/assets/images/bot-vector.png")}
              className="w-40 h-24"
              alt="test"
            />
          </VStack>

          <VStack space="md" className="flex-1 justify-between">
            <VStack space="sm">
              <Text className="font-vazirBold text-lg text-right text-white">
                روانشناس هوش مصنوعی
              </Text>
              <Text className="font-vazir text-xs text-right text-white">
                به راحتی احساسات خود را بیان کن و راهنمایی حرفه‌ای دریافت کن.
              </Text>
            </VStack>

            <Button
              size="md"
              className="bg-secondary-500"
              onPress={() => {
                router.navigate("/chat-bot");
              }}
            >
              <ButtonText>شروع گفتگو</ButtonText>
            </Button>
          </VStack>
        </HStack>
      </LinearGradient>
    </Pressable>
  );
};

export default memo(PsychoCard);
