import { useSuggestedMeditationsQuery } from "@/services/meditations/meditation-adapter";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Skeleton } from "../ui/skeleton";
import CourseCard from "./course-card";

const SKELETON_COUNT = 4;
const MAX_TO_RENDER = 4;
const WINDOW_SIZE = 5;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    paddingBottom: 16,
  },
  skeleton: {
    height: 208,
    width: 192,
    marginHorizontal: 8,
    borderRadius: 24,
  },
});

const SkeletonItem = memo(() => <Skeleton style={styles.skeleton} />);
const CourseCardItem = memo(({ item, index }: { item: any; index: number }) => (
  <CourseCard item={item} index={index} />
));

const Recommends = () => {
  const { data, isLoading } = useSuggestedMeditationsQuery(null);
  const flatListRef = useRef<FlatList>(null);

  const skeletonData = useMemo(
    () => Array.from({ length: SKELETON_COUNT }, (_, i) => ({ id: i })),
    []
  );

  const renderSkeleton = useCallback(() => <SkeletonItem />, []);
  const renderCourseCard = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <CourseCardItem item={item} index={index} />
    ),
    []
  );
  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const flatListOptimizations = useMemo(
    () => ({
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      contentContainerStyle: styles.contentContainer,
      keyExtractor,
      removeClippedSubviews: true,
      maxToRenderPerBatch: MAX_TO_RENDER,
      initialNumToRender: MAX_TO_RENDER,
      windowSize: WINDOW_SIZE,
      updateCellsBatchingPeriod: 50,
      decelerationRate: "fast" as const,
      scrollEventThrottle: 16,
      maintainVisibleContentPosition: {
        minIndexForVisible: 0,
      },
    }),
    [keyExtractor]
  );

  if (isLoading) {
    return (
      <FlatList
        ref={flatListRef}
        data={skeletonData}
        renderItem={renderSkeleton}
        {...flatListOptimizations}
      />
    );
  }

  const meditations = data?.meditations || [];
  if (meditations.length === 0) return null;

  return (
    <FlatList
      ref={flatListRef}
      data={meditations}
      renderItem={renderCourseCard}
      {...flatListOptimizations}
    />
  );
};

export default memo(Recommends);
