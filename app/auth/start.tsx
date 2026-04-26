import { Button, ButtonText } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { setIsInitialized } from "@/redux/intialize/initialize-slice";
import { router } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Start = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleInitialize = () => {
    dispatch(setIsInitialized(true));
    router.replace("/");
    // router.push("/auth/login");
  };
  return (
    <VStack
      style={{ paddingBottom: insets.bottom + 24 }}
      className="flex-1 bg-white items-center p-8  justify-between"
    >
      <VStack space="md" className="flex-1 items-center justify-center">
        {/* <Logo className="h-40 w-56" /> */}
        <Image
          source={require("@/assets/illustrations/Welcome.png")}
          className="h-40 mb-16 w-56"
        />
        <Text className="text-2xl font-vazirBold">
          به جانارام <Logo className="h-10 w-14" /> خوش اومدی
        </Text>
        <Text className="text-typography-400 font-vazirBold text-center text-md">
          با جانارام آرامشت رو پیدا کن
        </Text>
        <Text className="text-lg font-vazir  text-center ">
          آماده ای شروع کنی؟
        </Text>
      </VStack>
      <Button onPress={handleInitialize} className="w-full" size="xl">
        <ButtonText>شروع </ButtonText>
      </Button>
    </VStack>
  );
};

export default Start;
