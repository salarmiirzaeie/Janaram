import TestCard from "@/components/test/test-card";
import { useGetTestsQuery } from "@/services/test/test-adapter";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";

const Tests = () => {
  const { data } = useGetTestsQuery(null);

  // Sort tests: non-unlimited access first
  const sortedTests = useMemo(() => {
    const tests = data?.data || [];
    return [...tests].sort((a, b) => {
      const aIsUnlimited = a.access === "unlimited";
      const bIsUnlimited = b.access === "unlimited";
      // Put non-unlimited before unlimited
      if (aIsUnlimited === bIsUnlimited) return 0;
      return aIsUnlimited ? 1 : -1;
    });
  }, [data]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return <TestCard item={item} index={index} />;
  };

  return (
    <View className="p-4">
      <FlatList
        data={sortedTests}
        renderItem={renderItem}
        keyExtractor={(item) => item.test_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Tests;
