import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { useGetMeditationsQuery } from "@/services/meditations/meditation-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { toPersianDigits } from "@/utils/persian";

import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useDispatch } from "react-redux";

const SearchPage = () => {
  const { data, isLoading } = useGetMeditationsQuery(null);
  const [query, setQuery] = useState("");
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const dispatch = useDispatch();

  const handleOpenNotProModal = () => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
        showNotProModal: true,
      },
    });
  };

  const filteredData = data?.meditations.filter((item) =>
    item.title.includes(query.trim())
  );

  const recentSearches = ["آرامش", "خواب", "تمرکز", "یوگا"];

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <VStack className="flex-1 px-4 pt-8 pb-16">
        {/* Search Header */}
        <Animated.View entering={FadeIn.duration(500)}>
          <View className="mb-6">
            <Input
              size="xl"
              className="bg-white rounded-2xl border-gray-200 shadow-sm"
            >
              <InputSlot className="px-4 h-full">
                <Pressable
                  onPress={() => router.back()}
                  className="flex-1 justify-center items-center"
                >
                  <AntDesign name="left" size={22} color="#666" />
                </Pressable>
              </InputSlot>
              <InputField
                className="text-right font-vazir text-base"
                placeholder="جستجوی مدیتیشن، موسیقی و..."
                placeholderTextColor="#999"
                value={query}
                onChangeText={setQuery}
              />
              <InputSlot className="px-4 h-full">
                <Feather name="search" size={20} color="#79AED6" />
              </InputSlot>
            </Input>
          </View>
        </Animated.View>

        {/* Content */}
        <VStack className="flex-1 mt-2">
          {query.length === 0 ? (
            // Recent Searches Section
            <Animated.View entering={FadeInUp.duration(600).delay(100)}>
              <VStack space="lg">
                <View className="flex-row justify-between items-center">
                  <Text className="text-primary-600 text-sm font-vazir">
                    پاک کردن همه
                  </Text>
                  <Text className="text-primary-800 font-vazirBold text-base">
                    جستجوهای اخیر
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setQuery(search)}
                      className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
                    >
                      <Text className="text-gray-700 font-vazir text-sm">
                        {search}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </VStack>
            </Animated.View>
          ) : query.length > 0 && filteredData?.length === 0 ? (
            // No Results
            <Animated.View
              entering={FadeInUp.duration(400)}
              className="flex-1 justify-center items-center"
            >
              <View className="bg-white rounded-full p-6 mb-4 shadow-md">
                <Feather name="search" size={48} color="#79AED6" />
              </View>
              <Text className="text-gray-500 font-vazir text-lg text-center">
                موردی یافت نشد
              </Text>
              <Text className="text-gray-400 font-vazir text-sm text-center mt-1">
                عبارت دیگری را جستجو کنید
              </Text>
            </Animated.View>
          ) : (
            // Search Results
            <Animated.View entering={FadeInUp.duration(400)} className="flex-1">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-primary-600 text-xs font-vazir">
                  {toPersianDigits(filteredData?.length || 0)} نتیجه
                </Text>
                <Text className="text-primary-800 font-vazirBold text-base">
                  نتایج جستجو
                </Text>
              </View>

              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item, index }) => (
                  <Animated.View
                    entering={FadeInUp.duration(400).delay(index * 50)}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (item.isPro && !proPlan?.isActive) {
                          handleOpenNotProModal();
                          return;
                        }
                        router.push({
                          pathname: "/player",
                          params: { id: item.id },
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={["#FFFFFF", "#F9F9FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          padding: 16,
                          marginBottom: 12,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: "#E9EDF2",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.04,
                          shadowRadius: 4,
                          elevation: 2,
                        }}
                      >
                        <View className="flex-row justify-between items-center">
                          <View className="flex-row items-center gap-2">
                            {item.isPro && (
                              <View className="bg-accent-500/20 px-2 py-1 rounded-full">
                                <Text className="text-accent-600 font-vazirBold text-xs">
                                  Pro
                                </Text>
                              </View>
                            )}
                            <Text className="text-gray-400 text-xs font-vazir">
                              {toPersianDigits(item.duration)} دقیقه
                            </Text>
                          </View>
                          <View className="flex-1 mr-3">
                            <Text className="text-right text-base font-vazirBold text-gray-800">
                              {item.title}
                            </Text>
                          </View>
                          <View className="bg-primary-100 rounded-full p-2">
                            <Ionicons
                              name="play"
                              size={16}
                              color="#79AED6"
                              style={{ marginLeft: 2 }}
                            />
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </Animated.View>
          )}
        </VStack>
      </VStack>
    </LinearGradient>
  );
};

export default SearchPage;
