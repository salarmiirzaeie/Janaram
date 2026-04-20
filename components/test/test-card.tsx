import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useDispatch } from "react-redux";
const TestCard = ({ item, index }: { item: any; index: number }) => {
  const dispatch = useDispatch();
  const { data: plans } = usePlansQuery(null);

  const proPlan = useMemo(
    () => plans?.data.plans?.find((plan) => plan.name === "unlimited"),
    [plans?.data.plans]
  );
  const handleOpenNotProModal = useCallback(() => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
        showNotProModal: true,
      },
    });
  }, [dispatch]);
  const handleCardPress = useCallback(() => {
    if (item.access === "unlimited" && !proPlan?.isActive) {
      handleOpenNotProModal();
      return;
    }
    router.push({
      pathname: "/single-test",
      params: { id: `${item?.test_id}` },
    });
  }, [item.id, item.access, proPlan?.isActive, handleOpenNotProModal]);

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
        {item.access === "unlimited" && (
          <Badge className="absolute right-10 bg-accent-700 z-50 rounded-b-xl top-0">
            <BadgeText className="font-vazir text-white">Pro</BadgeText>
          </Badge>
        )}
        <LinearGradient
          colors={["#FFFFFF", "#F9F9FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 20,
            marginBottom: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E9EDF2",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <HStack className="items-center justify-between">
            {/* Icon */}
            <View className={`rounded-full p-3 ${"bg-primary-100"}`}>
              <FontAwesome5 name="clipboard-list" size={24} color="white" />
            </View>

            {/* Content */}
            <VStack className="flex-1 mx-3">
              <Text className="text-right font-vazirBold text-base text-gray-800">
                {item.test_name}
              </Text>

              {item.description && (
                <Text
                  className="text-right font-vazir text-sm text-gray-500 mt-1"
                  numberOfLines={2}
                >
                  {item.description.length > 60
                    ? item.description.slice(0, 60) + "..."
                    : item.description}
                </Text>
              )}
            </VStack>

            {/* Start Button */}
            <LinearGradient
              colors={["#79AED6", "#9966CC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <HStack space="sm" className="items-center">
                <FontAwesome name={"play"} size={12} color="white" />
                <Text className="text-white font-vazirBold text-sm">
                  {"شروع"}
                </Text>
              </HStack>
            </LinearGradient>
          </HStack>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TestCard;
