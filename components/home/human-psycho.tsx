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

const HumanPsycho: React.FC = (props) => {
  const toast = useCustomToast();
  const notificationCount = useAppSelector(
    (state) => state.notification.unReadNotifications
  );
  return (
    <Pressable
      className="shadow-sm bg-white flex-1 rounded-full"
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
      <VStack className=" p-4 rounded-3xl justify-between flex-1 bg-secondary-300 shadow">
        <HStack className="flex-1 justify-center items-center">
          <Image
            source={require("@/assets/images/bot-vector.png")}
            className="w-24 h-16"
            alt="test"
          />
          <VStack space="xl" className="flex-1 justify-between">
            <VStack space="md">
              <Text className="font-vazirBold text-sm text-right text-white">
                روانشناس متخصص
              </Text>
            </VStack>
          </VStack>
        </HStack>

        <Button
          size="sm"
          className="bg-secondary-500 w-full"
          onPress={() => {
            router.navigate("/chat-bot");
          }}
        >
          <ButtonText> رزرو نوبت</ButtonText>
        </Button>
      </VStack>
    </Pressable>
  );
};

export default HumanPsycho;
