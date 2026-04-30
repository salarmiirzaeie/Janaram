import MusicCard from "@/components/explore/music-card";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useGetBreathingsQuery } from "@/services/breathing/breathing-adapter";
import { Meditation } from "@/types";
import React from "react";
import { FlatList } from "react-native";

const AllMusics = () => {
  const { data, isLoading } = useGetBreathingsQuery(null);
  const meditations = data?.data;
  const renderMusicCard = (item: Meditation) => {
    return (
      <MusicCard
        isPro={item.isPremium || item.isPro || false}
        isBreathing
        item={item}
      />
    );
  };
  if (isLoading) {
    return (
      <VStack className="flex-1 bg-background-50 p-4">
        <Spinner />
      </VStack>
    );
  }
  return (
    <VStack className="flex-1 bg-background-50  px-4">
      <FlatList
        data={meditations || []}
        contentContainerClassName="pb-40 py-4"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMusicCard(item)}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};

export default AllMusics;
