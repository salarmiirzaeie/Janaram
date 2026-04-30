import { MainHeader } from "@/components/sleep/main-header";
import StoriesSection from "@/components/sleep/stories-section";
import TipSection from "@/components/sleep/tip-section";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import React, { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import HorizonList from "../../../components/sleep/horizon-list";

const IndexScreen = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null, {
    // These are the valid options:
    refetchOnMountOrArgChange: false, // Don't refetch when component mounts
    refetchOnFocus: false, // Don't refetch when app gets focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
    pollingInterval: undefined, // Disable polling
    skip: false, // Ensure it fetches
  });

  const sleepMusics = useMemo(
    () => exploreData?.meditations?.sleepMusic || [],
    [exploreData?.meditations?.sleepMusic]
  );
  const sleepMedias = useMemo(
    () => exploreData?.meditations?.sleep || [],
    [exploreData?.meditations?.sleep]
  );
  const sleepStories = useMemo(
    () => exploreData?.meditations?.story || [],
    [exploreData?.meditations?.story]
  );

  const sections = useMemo(
    () => [
      { id: "tip", component: "tip" },
      { id: "stories", component: "stories", data: sleepStories },
      { id: "sleep", component: "horizon", data: sleepMedias, type: "sleep" },
      {
        id: "sleep-music",
        component: "horizon",
        data: sleepMusics,
        type: "sleep-music",
      },
    ],
    [sleepStories, sleepMedias, sleepMusics]
  );

  const renderItem = useCallback(
    ({ item }: any) => {
      switch (item.component) {
        case "tip":
          return <TipSection />;
        case "stories":
          return <StoriesSection isLoading={isLoading} data={item.data} />;
        case "horizon":
          return (
            <HorizonList
              isLoading={isLoading}
              data={item.data}
              type={item.type}
            />
          );
        default:
          return null;
      }
    },
    [isLoading]
  );

  return (
    <LinearGradient
      colors={["#16213e", "#0a0a0f", "#1a1a2e"]}
      style={{ flex: 1 }}
    >
      <MainHeader showIcons />
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        removeClippedSubviews
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
        ListFooterComponent={<View className="h-80" />}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default React.memo(IndexScreen);
