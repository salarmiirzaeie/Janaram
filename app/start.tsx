import { Button, ButtonText } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { setIsInitialized } from "@/redux/intialize/initialize-slice";
import React from "react";
import { StatusBar } from "react-native";
import { useDispatch } from "react-redux";

const Start = () => {
  const dispatch = useDispatch();
  const handlePress = () => {
    dispatch(setIsInitialized(true));
  };
  return (
    <VStack className="flex-1 items-center p-8 justify-between">
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />

      <VStack space="md" className="flex-1 items-center justify-center">
        <Logo className="h-40 w-56" />
        <Text className="text-2xl font-semiBold">به جان آرام خوش اومدی</Text>
        <Text className="text-lg  text-center">حالت رو بهتر کن، ذهن‌تو آروم کن، و حال دلتو بساز</Text>
        <Text className="text-typography-400 text-center text-md">
          از صدای بارون و مدیتیشن، تا بررسی حالت روحی و چالش‌های کوچیک… همه‌چی آماده‌ست برای یه ذهن آروم‌تر 🌙
        </Text>
      </VStack>
      <Button onPress={handlePress} className="w-full " size="xl">
        <ButtonText>شروع </ButtonText>
      </Button>
    </VStack>
  );
};

export default Start;
