import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

const SectionHeader = ({
  title,
  icon,
  type,
}: {
  title: string;
  icon: React.ReactNode;
  type: "sleep" | "sleep-music" | "story";
}) => {
  const handleSeeAllPress = useCallback(() => {
    router.push({
      pathname: "/all-files",
      params: { type: type, title },
    });
  }, []);
  return (
    <HStack className="items-center justify-between mx-5 mb-3">
      <TouchableOpacity onPress={handleSeeAllPress}>
        <HStack space="sm" className="items-center">
          <Text className="text-primary-300 text-sm font-vazir">
            مشاهده همه
          </Text>
          <Feather name="arrow-left" size={14} color="#79AED6" />
        </HStack>
      </TouchableOpacity>
      <HStack space="sm" className="items-center">
        <Text className="font-vazirBold text-white text-xl">{title}</Text>
        {icon}
      </HStack>
    </HStack>
  );
};

export default React.memo(SectionHeader);
