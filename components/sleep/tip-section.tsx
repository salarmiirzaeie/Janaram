import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

const TipsSection = () => {
  return (
    <View className="mx-5 mt-8 mb-4">
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          paddingVertical: 15,
        }}
      >
        <HStack className="items-center gap-3">
          <View className="bg-primary-500/20 rounded-full p-3">
            <AntDesign name="bulb" size={24} color="#79AED6" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-vazirBold text-base text-right">
              نکته برای خواب بهتر
            </Text>
            <Text className="text-white/60 font-vazir text-xs text-right mt-1">
              قبل از خواب از صفحه نمایش استفاده نکنید و محیطی آرام برای خود
              ایجاد کنید
            </Text>
          </View>
        </HStack>
      </LinearGradient>
    </View>
  );
};

export default React.memo(TipsSection);
