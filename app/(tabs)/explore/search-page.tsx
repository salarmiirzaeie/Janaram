import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useGetMeditationsQuery } from "@/services/meditations/meditation-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";

import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text } from "react-native";
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

  return (
    <VStack className="flex-1 px-4 pt-8 py-safe-offset-4 pb-16 bg-gray-50">
      <Input size="xl" className="bg-white">
        <InputSlot className="px-3 h-full">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 justify-center items-center"
          >
            <AntDesign name="left" size={22} color="black" />
          </Pressable>
        </InputSlot>
        <InputField
          className="text-right"
          placeholder="جستجو"
          value={query}
          onChangeText={setQuery}
        />
      </Input>

      <VStack className="mt-4 space-y-2">
        {query.length > 0 && filteredData?.length === 0 && (
          <Text className="text-center text-gray-500">موردی یافت نشد</Text>
        )}

        {isLoading ? (
          [1, 2, 3, 4].map((item, index) => (
            <Skeleton key={item} className="h-18  mb-2 rounded-xl" />
          ))
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => Math.random().toString()}
            renderItem={({ item }) => (
              <Pressable
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
                className="p-4 bg-background-50 mb-2 rounded-xl shadow-sm"
              >
                <Text className="text-right text-base text-black">
                  {item.title}
                </Text>
              </Pressable>
            )}
          />
        )}
      </VStack>
    </VStack>
  );
};

export default SearchPage;
