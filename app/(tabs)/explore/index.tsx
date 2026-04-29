import Categories from "@/components/explore/categories";
import ExploreHeader from "@/components/explore/header";
import HorizonList from "@/components/explore/horizon-list";
import { Spinner } from "@/components/ui/spinner";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import React, { useMemo } from "react";
import { View } from "react-native";

const index = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null, {
    refetchOnMountOrArgChange: false,
  });
  const sectionsData = useMemo(() => {
    if (!exploreData?.meditations) return [];

    const m = exploreData.meditations;
    const sections = [];

    if (m.calm?.length) {
      sections.push({
        id: "calm",
        title: "آرامش",
        icon: <Feather name="wind" size={24} color="#79AED6" />,
        data: m.calm.map((item: any) => ({ ...item, type: "calm" })),
      });
    }

    if (m.self?.length) {
      sections.push({
        id: "self",
        title: "خودسازی",
        icon: (
          <MaterialIcons name="self-improvement" size={24} color="#9966CC" />
        ),
        data: m.self.map((item: any) => ({ ...item, type: "self" })),
      });
    }

    if (m.love?.length) {
      sections.push({
        id: "love",
        title: "عشق",
        icon: <Ionicons name="heart" size={24} color="#FF9966" />,
        data: m.love.map((item: any) => ({ ...item, type: "love" })),
      });
    }

    if (m.nature?.length) {
      sections.push({
        id: "nature",
        title: "طبیعت",
        icon: <MaterialIcons name="nature-people" size={24} color="#79AED6" />,
        data: m.nature.map((item: any) => ({ ...item, type: "nature" })),
      });
    }

    return sections;
  }, [exploreData]);
  return (
    <View className="flex-1 pt-4 bg-white">
      <ExploreHeader />
      <Categories />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner />
        </View>
      ) : (
        sectionsData && (
          <LegendList
            className="flex-1" // ← this works when parent has flex-1
            estimatedItemSize={250}
            data={sectionsData}
            renderItem={({ item }) => <HorizonList item={item} />}
          />
        )
      )}
    </View>
  );
};

export default index;
