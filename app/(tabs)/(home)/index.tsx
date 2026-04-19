import MoodCard from "@/components/home/mood-card";
import PsychoCard from "@/components/home/psycho-card";
import RateAppSheet from "@/components/home/rate-act";
import Recommends from "@/components/home/recommends";
import TestCard from "@/components/home/test-card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { BackHandler, ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

const Index = () => {
  const asked = useAppSelector((state) => state.initialize.isCommented);
  const [showRateModal, setShowRateModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (asked) {
          return false;
        }
        setShowRateModal(true);
        return true;
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => sub.remove();
    }, [asked])
  );

  const quickAccessItems = [
    {
      id: 1,
      title: "مدیتیشن",
      icon: <Feather name="wind" size={28} color="white" />,
      color: ["#79AED6", "#5E95BD"],
      route: "/explore",
    },
    {
      id: 2,
      title: "تنفس",
      icon: <MaterialIcons name="air" size={28} color="white" />,
      color: ["#9966CC", "#804DB3"],
      route: "/breathing",
    },
    {
      id: 3,
      title: "تست",
      icon: <FontAwesome5 name="clipboard-list" size={24} color="white" />,
      color: ["#FF9966", "#E6804D"],
      route: "/tests",
    },
    {
      id: 4,
      title: "روانشناس",
      icon: <Ionicons name="people" size={28} color="white" />,
      color: ["#91A5BE", "#7A8BA8"],
      route: "/psychologist",
    },
    {
      id: 5,
      title: "خواب",
      icon: <Feather name="moon" size={28} color="white" />,
      color: ["#79AED6", "#9966CC"],
      route: "/sleep",
    },
    {
      id: 6,
      title: "موسیقی",
      icon: <Ionicons name="musical-notes" size={26} color="white" />,
      color: ["#9966CC", "#FF9966"],
      route: "/music",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <LinearGradient colors={["#FFFFFF", "#F0F6FA"]} style={{ flex: 1 }}>
        <VStack className="flex-1 mb-40">
          {/* Mood Card Section */}
          <Animated.View entering={FadeInUp.duration(600).springify()}>
            <VStack className="w-full items-center justify-center px-5 py-2">
              <MoodCard />
            </VStack>
          </Animated.View>

          {/* Quick Access Grid - Single Row with 6 items */}
          <Animated.View entering={FadeInUp.duration(600).delay(150)}>
            <View className="px-5 mt-6">
              <View className="flex-row justify-between gap-2">
                {quickAccessItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(item.route as any)}
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                  >
                    <Animated.View
                      entering={FadeInUp.duration(400).delay(200 + index * 30)}
                    >
                      <LinearGradient
                        colors={item.color}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 16,
                          paddingVertical: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: item.color[0],
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.2,
                          shadowRadius: 6,
                          elevation: 4,
                        }}
                      >
                        <View className="mb-1.5">{item.icon}</View>
                        <Text className="text-white font-vazirBold text-[11px] text-center">
                          {item.title}
                        </Text>
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Psychologist Section */}
          <Animated.View entering={FadeInUp.duration(600).delay(400)}>
            <VStack space="md" className="mt-8 px-5">
              <HStack className="items-center justify-end">
                <HStack space="sm" className="items-center">
                  <Text className="font-vazirBold text-primary-800 text-xl">
                    روانشناس من
                  </Text>
                  <Ionicons name="people" size={22} color="#9966CC" />
                </HStack>
              </HStack>
              <PsychoCard />
            </VStack>
          </Animated.View>

          {/* Recommended Meditations */}
          <Animated.View entering={FadeInUp.duration(600).delay(500)}>
            <VStack space="lg" className="mt-8">
              <HStack className="items-center justify-between mx-5">
                <TouchableOpacity onPress={() => router.push("/explore")}>
                  <HStack space="sm" className="items-center">
                    <Text className="text-primary-600 text-sm font-vazir">
                      مشاهده همه
                    </Text>
                    <AntDesign name="left" size={14} color="#79AED6" />
                  </HStack>
                </TouchableOpacity>
                <HStack space="sm" className="items-center">
                  <Text className="font-vazirBold text-primary-800 text-xl">
                    مدیتیشن های پیشنهادی
                  </Text>
                  <Feather name="wind" size={22} color="#79AED6" />
                </HStack>
              </HStack>
              <Recommends />
            </VStack>
          </Animated.View>

          {/* Self-awareness Test */}
          <Animated.View entering={FadeInUp.duration(600).delay(600)}>
            <VStack space="md" className="mt-4 mb-5 px-5">
              <HStack className="items-center justify-end">
                <HStack space="sm" className="items-center">
                  <Text className="font-vazirBold text-primary-800 text-xl">
                    تست خودشناسی
                  </Text>
                  <FontAwesome5
                    name="clipboard-list"
                    size={20}
                    color="#FF9966"
                  />
                </HStack>
              </HStack>
              <TestCard />
            </VStack>
          </Animated.View>
        </VStack>
      </LinearGradient>

      <RateAppSheet
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
      />
    </ScrollView>
  );
};

export default React.memo(Index);
