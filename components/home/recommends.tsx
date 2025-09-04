import { useSuggestedMeditationsQuery } from "@/services/meditations/meditation-adapter";
import React from "react";
import { ScrollView } from "react-native";
import { Skeleton } from "../ui/skeleton";
import CourseCard from "./course-card";

const Recommends = () => {
  const { data, isLoading } = useSuggestedMeditationsQuery(null);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 10,
        flexDirection: "row-reverse",
        paddingBottom: 24,
      }}
      showsHorizontalScrollIndicator={false}
      horizontal
    >
      {isLoading
        ? [1, 2, 3, 4].map((item, index) => <Skeleton key={item} className="h-52 w-48 mx-2 rounded-xl" />)
        : data?.meditations?.map((item, index) => <CourseCard key={item.id} item={item} index={index} />)}
    </ScrollView>
  );
};

export default Recommends;
