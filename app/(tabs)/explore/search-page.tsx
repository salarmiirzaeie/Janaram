import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import data from "@/database/database.json";

import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text } from "react-native";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const filteredData = data.filter((item) => item.title.includes(query.trim()));

  return (
    <VStack className="flex-1 px-4 pt-8 py-safe-offset-4 pb-16 bg-gray-50">
      <Input size="xl" className="bg-white">
        <InputSlot className="px-3 h-full">
          <Pressable onPress={() => router.back()} className="flex-1 justify-center items-center">
            <AntDesign name="left" size={22} color="black" />
          </Pressable>
        </InputSlot>
        <InputField className="text-right" placeholder="جستجو" value={query} onChangeText={setQuery} />
      </Input>

      <VStack className="mt-4 space-y-2">
        {query.length > 0 && filteredData.length === 0 && (
          <Text className="text-center text-gray-500">موردی یافت نشد</Text>
        )}

        <FlatList
          data={filteredData}
          keyExtractor={(item) => Math.random().toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/player",
                  params: { id: `/meditations/${item.id}`, title: item.title, artist: item.artist, image: item.image },
                })
              }
              className="p-4 bg-background-50 mb-2 rounded-xl shadow-sm"
            >
              <Text className="text-right text-base text-black">{item.title}</Text>
            </Pressable>
          )}
        />
      </VStack>
    </VStack>
  );
};

export default SearchPage;
