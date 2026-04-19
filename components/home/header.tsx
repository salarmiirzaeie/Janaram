import { useCustomToast } from "@/hooks/useToast";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { HStack } from "../ui/hstack";
import Logo from "../ui/logo";

type CustomHeaderProps = {
  data: any;
  proPlan: any;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CustomHeader({ data, proPlan }: CustomHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const isActive = proPlan?.isActive;

  const scalePro = useSharedValue(1);
  const scaleStreak = useSharedValue(1);

  const proAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scalePro.value }],
  }));

  const streakAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleStreak.value }],
  }));

  const handleProPress = () => {
    scalePro.value = withSpring(0.95, {}, () => {
      scalePro.value = withSpring(1);
    });

    if (!isActive) {
      dispatch({
        type: "initialize/setIsFirstModalShow",
        payload: true,
      });
    } else {
      toast.show({ msg: "پلن Pro شما فعال است", type: "success" });
    }
  };

  const handleStreakPress = () => {
    scaleStreak.value = withSpring(0.95, {}, () => {
      scaleStreak.value = withSpring(1);
    });
    router.navigate("/streak");
  };

  return (
    <SafeAreaView edges={["top"]} className="bg-white">
      <Animated.View entering={FadeIn.duration(500)}>
        <HStack
          space="md"
          className="items-center bg-white/95 backdrop-blur-sm py-3 px-4 justify-between border-b border-gray-100 shadow-sm"
        >
          {/* Left - Streak Section with fixed width */}
          <View className="w-24">
            <AnimatedPressable
              style={streakAnimatedStyle}
              className="items-center flex-row py-2 rounded-full active:opacity-70"
              onPress={handleStreakPress}
            >
              <View className="flex-row items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-full">
                <MaterialIcons name="whatshot" size={18} color="#FF9966" />
                <Text className="text-base font-vazirBold text-primary-700">
                  {toPersianDigits(data?.data.totalMoodDays || 0)}
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Middle - Logo - Now truly centered */}
          <View className="items-center justify-center flex-1">
            <Logo className="h-12 w-20" />
          </View>

          {/* Right - Pro Section with fixed width */}
          <View className="w-24 items-end">
            <AnimatedPressable
              style={proAnimatedStyle}
              className="items-center flex-row px-3 py-2 rounded-full active:opacity-70"
              onPress={handleProPress}
            >
              <View className="flex-row items-center gap-1.5 bg-primary-50/50 px-3 py-1.5 rounded-full">
                <FontAwesome6
                  size={16}
                  name="crown"
                  color={isActive ? "#FF9966" : "#91A5BE"}
                />
                <Text
                  className={`text-sm font-vazirBold ${
                    isActive ? "text-accent-600" : "text-tertiary-500"
                  }`}
                >
                  Pro
                </Text>
                {isActive && (
                  <View className="absolute -top-1 -right-1">
                    <View className="w-2 h-2 bg-green-500 rounded-full" />
                  </View>
                )}
              </View>
            </AnimatedPressable>
          </View>
        </HStack>
      </Animated.View>
    </SafeAreaView>
  );
}
