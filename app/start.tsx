import { Button, ButtonText } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { setIsInitialized } from "@/redux/intialize/initialize-slice";
import { router } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Start = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleInitialize = () => {
    dispatch(setIsInitialized(true));
    router.replace("/");
  };
  return (
    <VStack style={{ paddingBottom: insets.bottom + 24 }} className="flex-1 items-center p-8  justify-between">
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />

      <VStack space="md" className="flex-1 items-center justify-center">
        <Logo className="h-40 w-56" />
        <Text className="text-2xl font-semiBold">به جانارام خوش اومدی</Text>
        <Text className="text-lg  text-center">🌿 جانارام، همراهی برای ذهنی آرام‌تر</Text>
        <Text className="text-typography-400 text-center text-md">
          با مدیتیشن‌های متنوع، موسیقی و قصه‌های خواب، پیگیری حال روحی و گفت‌و‌گو با چت بات روانشناس من ، «جانارام»
          همیشه کنارته… برای خوابی راحت‌تر و ذهنی سبک‌تر.
        </Text>
      </VStack>
      <Button onPress={handleInitialize} className="w-full " size="xl">
        <ButtonText>شروع </ButtonText>
      </Button>
    </VStack>
  );
};

export default Start;
