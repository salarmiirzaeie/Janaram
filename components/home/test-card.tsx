import { useCustomToast } from "@/hooks/useToast";
import React from "react";
import { Image } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const TestCard: React.FC = (props) => {
  const toast = useCustomToast();
  return (
    <Pressable
      onPress={() => {
        // router.navigate("/chat-bot");
        toast.show({
          msg: "در حال توسعه",
          type: "success",
        });
      }}
    >
      <HStack className={`  py-5 pr-5  rounded-3xl  justify-between w-full bg-pink-300 shadow shadow-md`}>
        <VStack className="flex-1 justify-center items-center">
          <Image source={require("@/assets/images/bot-vector.png")} className="w-44 h-28" alt="test" />
        </VStack>
        <VStack space="xl" className="flex-1 justify-between">
          <VStack space="md">
            <Text className="font-semiBold text-md text-right text-white">روانشناس هوش مصنوعی</Text>
            <Text className="font-medium text-xs text-right color-white">
              به راحتی احساسات خود را بیان کن و راهنمایی حرفه‌ای دریافت کن.
            </Text>
          </VStack>
          <Button
            className="bg-pink-500"
            onPress={() => {
              // router.navigate("/chat-bot");
              toast.show({
                msg: "در حال توسعه",
                type: "success",
              });
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
