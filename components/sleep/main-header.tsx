import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

// ========== کامپوننت مجزا برای هدر اصلی ==========
export const MainHeader = React.memo(
  ({ showIcons }: { showIcons?: boolean }) => {
    const handleBack = useCallback(() => {
      router.back();
    }, []);
    const handleSearch = useCallback(() => {
      router.push("/search-page");
    }, []);
    return (
      <>
        <StatusBar backgroundColor={"#1a1a2e"} barStyle={"light-content"} />
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.1)",
          }}
        >
          <HStack className="items-center justify-between">
            {showIcons ? (
              <TouchableOpacity
                onPress={handleSearch}
                className={`w-10 h-10 rounded-full bg-white/10 justify-center items-center`}
              >
                <Feather name="search" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleBack}
                className={`w-10 h-10 rounded-full bg-white/10 justify-center items-center`}
              >
                <AntDesign name="left" size={20} color="white" />
              </TouchableOpacity>
            )}
            <HStack space="sm" className="items-center">
              <Feather name="moon" size={20} color="#79AED6" />
              <Text className="text-white font-vazirBold text-lg">
                خواب آرام
              </Text>
            </HStack>
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
            >
              <View className="w-6 h-6" />
            </TouchableOpacity>
          </HStack>
        </LinearGradient>
      </>
    );
  }
);
