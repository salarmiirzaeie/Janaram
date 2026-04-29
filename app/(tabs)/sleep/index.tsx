import { MainHeader } from "@/components/sleep/main-header";
import StoriesSection from "@/components/sleep/stories-section";
import TipSection from "@/components/sleep/tip-section";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import HorizonList from "../../../components/sleep/horizon-list";

const index = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null);

  // استخراج دیتا با useMemo
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
  return (
    <LinearGradient
      colors={["#16213e", "#0a0a0f", "#1a1a2e"]}
      style={{ flex: 1 }}
    >
      <MainHeader showIcons />
      <View className="flex-1">
        <ScrollView>
          <TipSection />
          {sleepStories && (
            <StoriesSection isLoading={isLoading} data={sleepStories} />
          )}
          {sleepMedias && (
            <HorizonList
              type="sleep"
              isLoading={isLoading}
              data={sleepMedias}
            />
          )}
          {sleepMusics && (
            <HorizonList
              type="sleep-music"
              isLoading={isLoading}
              data={sleepMusics}
            />
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default index;
