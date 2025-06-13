import { IMusic } from "@/components/sleep/course-card-sleep";
import MusicCard from "@/components/sleep/music-card";
import { VStack } from "@/components/ui/vstack";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

const AllMusics = () => {
  const params = useLocalSearchParams<{ fileName: string }>();

  const getData = () => {
    switch (params.fileName) {
      case "sleep-music":
        return require("@/database/sleep-music.json");
      default:
        return [];
    }
  };

  const data: IMusic[] = getData();

  const renderMusicCard = (item: IMusic) => {
    return <MusicCard item={item} />;
  };

  return (
    <VStack className="flex-1 bg-background-50 p-4">
      <FlatList
        data={data.slice(0, 15)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMusicCard(item)}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};

export default AllMusics;
