import { MaterialIcons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { useCallback, useMemo } from "react";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";
import SectionHeader from "./section-header";
import StoryCard from "./story-card";

const StoriesSection = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) => {
  const skeletonData = useMemo(() => [1, 2], []);
  const renderSkeleton = useCallback(
    () => (
      <HStack space="md" className="px-3">
        {skeletonData.map((item) => (
          <Skeleton
            key={item}
            style={{
              width: 300,
              height: 224,
              marginHorizontal: 8,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
        ))}
      </HStack>
    ),
    []
  );
  console.log(data, "s");
  if (data.length === 0 && !isLoading) return null;

  return (
    <VStack space="md" className="mt-2">
      <SectionHeader
        title="قصه‌های شب"
        icon={<MaterialIcons name="auto-stories" size={22} color="#79AED6" />}
        type="story"
      />
      <LegendList
        data={data}
        keyExtractor={(item) => item.id?.toString() || `story-${item.title}`}
        renderItem={({ item, index }) => (
          <StoryCard item={item} index={index} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ListEmptyComponent={isLoading ? renderSkeleton : null}
      />
    </VStack>
  );
};
export default StoriesSection;
