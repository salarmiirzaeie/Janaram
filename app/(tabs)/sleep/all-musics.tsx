import { IMusic } from "@/components/sleep/course-card-sleep";
import MusicCard from "@/components/sleep/music-card";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useMeditationsWithCategoryQuery } from "@/services/meditations/meditation-adapter";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

const AllMusics = () => {
  const params = useLocalSearchParams<{ type: string }>();
  const { data, isLoading } = useMeditationsWithCategoryQuery({ category: params.type });
  const renderMusicCard = (item: IMusic) => {
    return <MusicCard item={item} />;
  };
  if (isLoading) {
    return (
      <VStack className="flex-1 bg-background-50 p-4">
        <Spinner />
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 bg-background-900 p-4">
      <FlatList
        data={data.meditations || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMusicCard(item)}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};

export default AllMusics;
