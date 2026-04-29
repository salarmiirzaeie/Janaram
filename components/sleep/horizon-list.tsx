import SleepCourseCard from "@/components/sleep/course-card-sleep";
import SectionHeader from "@/components/sleep/section-header";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import React, { useCallback, useMemo } from "react";

const HorizonList = ({
  data,
  isLoading,
  type,
}: {
  data: any[];
  isLoading: boolean;
  type: "sleep" | "sleep-music" | "story";
}) => {
  const skeletonData = useMemo(() => [1, 2, 3], []);
  const renderSkeleton = useCallback(
    () => (
      <HStack space="md" className="px-3">
        {skeletonData.map((item) => (
          <Skeleton
            className="w-48"
            key={item}
            style={{
              height: 230,
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

  if (data.length === 0 && !isLoading) return null;

  return (
    <VStack space="lg" className="mt-6">
      <SectionHeader
        title={type === "sleep" ? "مدیتیشن‌های خواب" : "آهنگ های خواب"}
        icon={
          <Feather
            name={type === "sleep" ? "moon" : "music"}
            size={22}
            color="#79AED6"
          />
        }
        type={type}
      />
      <LegendList
        data={data}
        keyExtractor={(item) => item.id?.toString() || `sleep-${item.title}`}
        renderItem={({ item, index }) => (
          <SleepCourseCard index={index} item={item} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ListEmptyComponent={isLoading ? renderSkeleton : null}
      />
    </VStack>
  );
};

export default HorizonList;
