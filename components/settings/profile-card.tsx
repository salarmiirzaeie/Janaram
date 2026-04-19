import { useProfileQuery } from "@/services/auth/auth-adapter";
import { unNormalizePhoneNumber } from "@/utils/phone";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const ProfileCard = () => {
  const { data, isLoading } = useProfileQuery(null);

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#F9F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          margin: 16,
          marginBottom: 8,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <HStack className="justify-between items-center">
          <View className="w-12 h-12 rounded-full bg-gray-200" />
          <VStack className="items-end">
            <Skeleton className="bg-gray-200 w-32 h-5 rounded-md" />
            <Skeleton className="bg-gray-200 mt-2 w-28 h-4 rounded-md" />
          </VStack>
        </HStack>
      </LinearGradient>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(600).springify()}>
      <LinearGradient
        colors={["#FFFFFF", "#F9F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          margin: 16,
          marginBottom: 8,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <HStack className="justify-between items-center">
          {/* Avatar / Profile Icon */}
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/setting/edit-profile")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#79AED6", "#9966CC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#79AED6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Feather name="user" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* User Info */}
          <VStack className="items-end flex-1 mr-4">
            <Text className="font-vazirBold text-base text-gray-800 text-right">
              {data?.data.name === ""
                ? "لطفا پروفایل خود را تکمیل کنید"
                : data?.data.name || "کاربر عزیز"}
            </Text>
            <HStack space="sm" className="items-center mt-1">
              <Feather name="phone" size={12} color="#999" />
              <Text className="text-right text-tertiary-500 font-vazir text-sm">
                {unNormalizePhoneNumber(data?.data.phoneNumber || "")}
              </Text>
            </HStack>

            {/* Edit badge */}
            <TouchableOpacity
              onPress={() => router.navigate("/(tabs)/setting/edit-profile")}
              className="mt-2"
            >
              <HStack space="sm" className="items-center">
                <Text className="text-primary-500 font-vazir text-xs">
                  ویرایش پروفایل
                </Text>
                <Feather name="edit-2" size={12} color="#79AED6" />
              </HStack>
            </TouchableOpacity>
          </VStack>
        </HStack>
      </LinearGradient>
    </Animated.View>
  );
};

export default ProfileCard;
