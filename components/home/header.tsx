// components/CustomHeader.tsx
import { useCustomToast } from "@/hooks/useToast";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { useDispatch } from "react-redux"; // adjust to your setup
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
    <HStack space="md" className="items-center bg-white py-2 px-4 justify-between">
      {/* Title */}

      {/* Left */}
      <Pressable className="items-center flex-row pl-1 pr-4" onPress={() => router.navigate("/streak")}>
        <Text className="text-lg">🌱 </Text>
        <Text className="text-lg font-vazirBold mt-1">{toPersianDigits(data?.data.totalMoodDays || 0)}</Text>
      </Pressable>
      <Logo className="h-10 w-16" />

      {/* Right */}
      <Pressable
        className="items-center flex-row "
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
  );
}
