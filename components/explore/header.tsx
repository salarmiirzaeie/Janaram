import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { HStack } from "../ui/hstack";

const ExploreHeader = () => {
  const handleSearchPress = useCallback(() => {
    router.navigate("/search-page");
  }, []);
  return (
    <>
      <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />

      <HStack className="mx-5   items-center justify-between mb-6">
        <TouchableOpacity onPress={handleSearchPress} className="flex-1">
          <View
            style={{
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 1,
              borderColor: "#E9EDF2",
            }}
          >
            <Feather name="search" size={20} color="#79AED6" />
            <Text className="text-gray-400 font-vazir flex-1 text-right">
              جستجوی مدیتیشن، موسیقی و...
            </Text>
            <Feather name="mic" size={20} color="#79AED6" />
          </View>
        </TouchableOpacity>
      </HStack>
    </>
  );
};

export default React.memo(ExploreHeader);
