import { useProfileQuery } from "@/services/auth/auth-adapter";
import { unNormalizePhoneNumber } from "@/utils/phone";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { Avatar, AvatarBadge, AvatarImage } from "../ui/avatar";
import { Pressable } from "../ui/pressable";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

const ProfileCard = () => {
  const { data, isLoading } = useProfileQuery(null);
  if (isLoading) {
    return (
      <VStack className="bg-primary-500 rounded-b-3xl py-10 px-4 justify-center items-center">
        <Skeleton variant="circular" className="h-[96px] w-[96px]" />
        <SkeletonText _lines={1} className="h-4 w-24 mt-6 self-center" />
        <SkeletonText _lines={1} className="h-4 w-32 mt-2 self-center" />
      </VStack>
    );
  }

  return (
    <VStack className="bg-primary-500 rounded-b-3xl py-10 px-4 justify-center items-center">
      <Avatar size="xl">
        <AvatarImage source={require("@/assets/images/defaultAvatar.png")} />

        <AvatarBadge className="justify-center items-center bg-white">
          <Pressable
            onPress={() => {
              router.navigate("/(tabs)/setting/edit-profile");
            }}
          >
            <AntDesign color={"purple"} name="edit" />
          </Pressable>
        </AvatarBadge>
      </Avatar>
      <Text className="font-semiBold mt-6 text-white">{data?.data.name}</Text>
      <Text className="mt-2 text-white">{unNormalizePhoneNumber(data?.data.phoneNumber || "")}</Text>
    </VStack>
  );
};

export default ProfileCard;
