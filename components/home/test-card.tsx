import { useAppSelector } from "@/hooks/useAppSelector";
import { useCustomToast } from "@/hooks/useToast";
import { router } from "expo-router";
import React, { memo } from "react";
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const TestCard: React.FC = (props) => {
  const toast = useCustomToast();
  const notificationCount = useAppSelector(
    (state) => state.notification.unReadNotifications
  );
  return (
    <Pressable
      className=" rounded-full"
      onPress={() => {
        router.navigate("/tests");
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
        colors={["#87B7D7", "#E1EDF5"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ borderRadius: 20 }}
      >
        <HStack className="py-3 pr-5 rounded-3xl justify-between w-full ">
          <VStack className="flex-1 justify-center items-center">
            <Image
              source={require("@/assets/illustrations/selfknown.png")}
              className="w-44 h-28"
              alt="test"
            />
          </VStack>

          <VStack space="md" className="flex-1 justify-between">
            <VStack space="sm">
              <Text className="font-vazirBold text-lg text-right text-white">
                تست خودشناسی علمی
              </Text>
              <Text className="font-vazir text-xs text-right text-white">
                با انجام تست های خود شناسی معتبر خودتون رو بهتر بشناسید
              </Text>
            </VStack>

            <Button
              size="md"
              className="bg-primary-500"
              onPress={() => {
                router.navigate("/tests");
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

export default memo(TestCard);
