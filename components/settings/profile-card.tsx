import { useProfileQuery } from "@/services/auth/auth-adapter";
import { unNormalizePhoneNumber } from "@/utils/phone";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

const ProfileCard = () => {
  const { data, isLoading } = useProfileQuery(null);
  if (isLoading) {
    return (
      <HStack className="border-b-2 border-gray-200 p-6 justify-between items-center">
        <Pressable>
          <Skeleton className="bg-gray-200 w-10 h-10 rounded-full" />
        </Pressable>
        <VStack>
          <Skeleton className="bg-gray-200 w-20 h-2" />
          <Skeleton className="bg-gray-200 mt-1 w-20 h-2" />
        </VStack>
      </HStack>
    );
  }

  return (
    <HStack className="border-b-2 border-gray-200 p-6 justify-between items-center">
      <Pressable
        onPress={() => {
          router.navigate("/(tabs)/setting/edit-profile");
        }}
      >
        <FontAwesome name="edit" size={24} color="rgb(134,179,210)" />
      </Pressable>
      <VStack>
        <Text className="font-semiBold text-right">{data?.data.name}</Text>
        <Text className="">{unNormalizePhoneNumber(data?.data.phoneNumber || "")}</Text>
      </VStack>
    </HStack>
  );
};

export default ProfileCard;
