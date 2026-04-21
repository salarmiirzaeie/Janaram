import { MainHeader } from "@/components/sleep/main-header";
import MusicCard from "@/components/sleep/music-card";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useMeditationsWithCategoryQuery } from "@/services/meditations/meditation-adapter";
import { Meditation } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const AllMusics = () => {
  const params = useLocalSearchParams<{ type: string }>();
  const { data, isLoading } = useMeditationsWithCategoryQuery({
    category: params.type,
  });
  const renderMusicCard = (item: Meditation) => {
    return <MusicCard item={item} />;
  };
  if (isLoading) {
    return (
      <VStack className="flex-1 bg-background-900  p-4">
        <Spinner />
      </VStack>
    );
  }

  return (
    <LinearGradient
      colors={["#16213e", "#0a0a0f", "#1a1a2e"]}
      style={{ flex: 1 }}
    >
      <MainHeader
        showIcons={false}
        onSearch={() => {}}
        onBack={() => {
          router.back();
        }}
      />
      <View className="flex-1  p-4 mb-16 bg-transparent">
        <FlatList
          data={data.meditations || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderMusicCard(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          initialNumToRender={3}
          maxToRenderPerBatch={2}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>
    </LinearGradient>
  );
};

export default AllMusics;
