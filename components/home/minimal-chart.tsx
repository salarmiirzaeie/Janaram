import { useAppSelector } from "@/hooks/useAppSelector";
import { preparePieData } from "@/utils/mood";
import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const MinimalChart = () => {
  const moods = useAppSelector((state) => state.mood);
  const pieData = preparePieData(moods);
  const moodCount = moods.filter((mood) => mood.mood !== null).length;

  return (
    <View className="  h-[210px] items-center">
      {/* <Text
        style={{
          fontSize: 14,
          color: "gray",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        15 April - 21 April
      </Text> */}

      <PieChart data={pieData} radius={80} textSize={14} focusOnPress innerRadius={70} />
    </View>
  );
};

export default MinimalChart;
