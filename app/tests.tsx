import TestCard from "@/components/test/test-card";
import { useGetTestsQuery } from "@/services/test/test-adapter";
import React from "react";
import { FlatList, View } from "react-native";

const tests = () => {
  const { data } = useGetTestsQuery(null);
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return <TestCard item={item} index={index} />;
  };
  return (
    <View className="p-4">
      <FlatList
        data={data?.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.test_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default tests;
