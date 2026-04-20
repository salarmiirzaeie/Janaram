import MusicCard from "@/components/explore/music-card";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useMeditationsWithCategoryQuery } from "@/services/meditations/meditation-adapter";
import { Meditation } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";

const AllMusics = () => {
  const params = useLocalSearchParams<{ type: string }>();
  const { data, isLoading } = useMeditationsWithCategoryQuery({
    category: params.type,
  });

  // Filter out any undefined/null items
  const meditations = useMemo(
    () =>
      (data?.meditations || []).filter(
        (item: any): item is Meditation => item != null
      ),
    [data?.meditations]
  );

  const renderMusicCard = useCallback(({ item }: { item: Meditation }) => {
    return <MusicCard item={item} />;
  }, []);

  const keyExtractor = useCallback(
    (item: Meditation) => item.id.toString(),
    []
  );

  if (isLoading) {
    return (
      <VStack className="flex-1 bg-background-50 p-4 items-center justify-center">
        <Spinner />
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 bg-background-50 p-4">
      <FlatList
        data={meditations}
        keyExtractor={keyExtractor}
        renderItem={renderMusicCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </VStack>
  );
};

export default React.memo(AllMusics);
