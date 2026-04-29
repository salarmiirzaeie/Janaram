import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { FC, ReactNode, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { HStack } from "../ui/hstack";
interface headerProps {
  icon: ReactNode;
  title: string;
  id: string;
}
const HorizonListHeader: FC<headerProps> = ({ title, icon, id }) => {
  const handleSeeAllPress = useCallback(() => {
    router.push({
      pathname: "/all-files",
      params: { type: id, title },
    });
  }, []);
  return (
    <HStack className="items-center justify-between mx-5 mb-3">
      <TouchableOpacity onPress={handleSeeAllPress}>
        <HStack space="sm" className="items-center">
          <Text className="text-primary-600 text-sm font-vazir">
            مشاهده همه
          </Text>
          <Ionicons name="chevron-back" size={16} color="#79AED6" />
        </HStack>
      </TouchableOpacity>
      <HStack space="sm" className="items-center">
        <Text className="text-xl font-vazirBold text-primary-800">{title}</Text>
        <View className="ml-1">{icon}</View>
      </HStack>
    </HStack>
  );
};

export default React.memo(HorizonListHeader);
