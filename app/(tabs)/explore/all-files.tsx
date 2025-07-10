import MusicCard from "@/components/explore/music-card";
import { IMusic } from "@/components/sleep/course-card-sleep";
import { VStack } from "@/components/ui/vstack";
import meditations from "@/database/database.json";
import nature from "@/database/nature.json";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

const AllMusics = () => {
  const calmMedias = meditations.slice(0, 5).sort((a, b) => b.id - a.id);
  const loveMedias = meditations.slice(5, 10).sort((a, b) => b.id - a.id);
  const instrumentalMedias = meditations.slice(10, 15).sort((a, b) => b.id - a.id);
  const params = useLocalSearchParams<{ type: string }>();

  const getData = () => {
    switch (params.type) {
      case "1":
        return calmMedias;
      case "2":
        return loveMedias;
      case "3":
        return instrumentalMedias;
      case "4":
        return nature;
      default:
        return [];
    }
  };

  const data: IMusic[] = getData();

  const renderMusicCard = (item: IMusic) => {
    return <MusicCard type={Number(params.type)} item={item} />;
  };

  return (
    <VStack className="flex-1 bg-background-50 p-4">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMusicCard(item)}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};

export default AllMusics;
