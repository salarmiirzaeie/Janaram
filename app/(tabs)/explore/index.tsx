import Categories from "@/components/explore/categories";
import ExploreHeader from "@/components/explore/header";
import HorizonList from "@/components/explore/horizon-list";
import { Spinner } from "@/components/ui/spinner";
import { useGetExploreQuery } from "@/services/meditations/meditation-adapter";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";

// Move icons outside component
const SECTION_ICONS = {
  calm: <Feather name="wind" size={24} color="#79AED6" />,
  self: <MaterialIcons name="self-improvement" size={24} color="#9966CC" />,
  love: <Ionicons name="heart" size={24} color="#FF9966" />,
  nature: <MaterialIcons name="nature-people" size={24} color="#79AED6" />,
};

const LoadingState = React.memo(() => (
  <View className="flex-1">
    <Categories />
    <View className="justify-center items-center flex-1">
      <Spinner />
    </View>
  </View>
));

const index = () => {
  const { data: exploreData, isLoading } = useGetExploreQuery(null, {
    refetchOnMountOrArgChange: false,
  });

  const sectionsData = useMemo(() => {
    if (!exploreData?.meditations) return [];

    const m = exploreData.meditations;

    const sectionConfigs = [
      {
        id: "calm",
        title: "آرامش",
        icon: SECTION_ICONS.calm,
        type: "calm",
        data: m.calm,
      },
      {
        id: "self",
        title: "خودسازی",
        icon: SECTION_ICONS.self,
        type: "self",
        data: m.self,
      },
      {
        id: "love",
        title: "عشق",
        icon: SECTION_ICONS.love,
        type: "love",
        data: m.love,
      },
      {
        id: "nature",
        title: "طبیعت",
        icon: SECTION_ICONS.nature,
        type: "nature",
        data: m.nature,
      },
    ];

    return sectionConfigs
      .filter((config) => config.data?.length)
      .map((config) => ({
        id: config.id,
        title: config.title,
        icon: config.icon,
        data: config.data.map((item: any) => ({ ...item, type: config.type })),
      }));
  }, [exploreData]);

  const renderItem = useCallback(
    ({ item }: any) => <HorizonList item={item} />,
    []
  );

  if (isLoading) {
    return (
      <View className="flex-1 pt-4 bg-white">
        <ExploreHeader />
        <LoadingState />
      </View>
    );
  }

  return (
    <View className="flex-1 pt-4 bg-white">
      <ExploreHeader />
      {sectionsData?.length > 0 && (
        <FlatList
          data={sectionsData}
          renderItem={renderItem}
          ListHeaderComponent={Categories}
          ListFooterComponent={<View className="h-80" />}
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default React.memo(index);
