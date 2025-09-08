import { useCustomToast } from "@/hooks/useToast";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅
import { useDispatch } from "react-redux";
import { HStack } from "../ui/hstack";
import Logo from "../ui/logo";

type CustomHeaderProps = {
  data: any;
  proPlan: any;
};

export default function CustomHeader({ data, proPlan }: CustomHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const isActive = proPlan?.isActive;

  return (
    <SafeAreaView edges={["top"]} className="bg-white">
      <HStack space="md" className="items-center bg-white py-2 px-4 justify-between">
        {/* Left */}
        <Pressable className="items-center flex-row pl-1 pr-4" onPress={() => router.navigate("/streak")}>
          <Text className="text-lg">🌱 </Text>
          <Text className="text-lg font-vazirBold mt-1">{toPersianDigits(data?.data.totalMoodDays || 0)}</Text>
        </Pressable>

        {/* Middle */}
        <Logo className="h-10 w-16" />

        {/* Right */}
        <Pressable
          className="items-center flex-row"
          onPress={() =>
            !isActive
              ? dispatch({
                  type: "initialize/setIsFirstModalShow",
                  payload: true,
                })
              : toast.show({ msg: "پلن Pro شما فعال است", type: "success" })
          }
        >
          <Text className={`text-lg font-vazirBold ${isActive ? "text-green-500" : "text-accent-400"}`}>Pro</Text>
          <FontAwesome6 size={18} name="crown" color={isActive ? "#4ade80" : "#FFB74D"} />
        </Pressable>
      </HStack>
    </SafeAreaView>
  );
}
